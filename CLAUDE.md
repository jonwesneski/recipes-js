# CLAUDE.md — recipes-js

This is a pnpm monorepo. Key apps and packages:

- `apps/api` — NestJS backend
- `apps/ui` — Next.js (App Router) frontend
- `packages/database` — Prisma client and schema
- `packages/nest-shared` — Shared NestJS services (e.g., PrismaService)
- `packages/design-system` — Tailwind config and shared UI primitives
- `packages/codegen` — Orval-generated typed API clients and MSW handlers (do not hand-edit)

---

## UI (`apps/ui`)

All references to the UI in this section refer to `apps/ui`.

### Ingredient Input — Single String, Split Internally

From the user's perspective, each ingredient is a **single plain-text string** typed into a `<textarea>`. The format is space-delimited:

```
[amount] [unit] [name]
```

Examples: `"2 cups flour"`, `"1 1/2 tablespoons olive oil"`, `"3 eggs"`

The amount can be **one or two words** — fractions like `1 1/2` occupy two space-separated tokens. The logic in `splitIngredientDisplay` detects this by checking whether the second word contains `/`.

Internally the string is immediately parsed by `parseIngredientString` (in `apps/ui/src/utils/ingredientHelper.ts`) into a `NormalizedIngredient`, which splits the single string into three structured sections.

---

### `NormalizedIngredient` — the internal shape

Defined in `apps/ui/src/zod-schemas/recipeNormalized.ts`.

```ts
{
  amount: { display: string; value: number; errors?: string[] }
  isFraction: boolean
  unit:   { display: string; value: MeasurementUnitType | null; errors?: string[] }
  name:   { display: string; value: string; errors?: string[] }
}
```

Every field carries both a **`display`** string (exactly what the user typed, including trailing spaces) and a **`value`** (the parsed/normalized form). Concatenating `amount.display + unit.display + name.display` exactly reproduces the original raw textarea string — this invariant is maintained so the textarea stays in sync.

- `amount.value` — parsed as a float or via `fractionToNumber()`. `NaN` when the input is not yet a valid number.
- `isFraction` — `true` when `fractionToNumber()` succeeded (e.g. `"1/2"`, `"1 1/2"`). Affects how amounts are formatted back for display elsewhere in the app (e.g. recipe scaling).
- `unit.value` — a `MeasurementUnitType` enum value (e.g. `"cups"`, `"tablespoons"`) or `null` if absent/unrecognized.
- `name.value` — the trimmed ingredient name string.

---

### Parsing and splitting

`parseIngredientString(input: string): NormalizedIngredient`
Located in `apps/ui/src/utils/ingredientHelper.ts`.

1. Trims and splits into words.
2. Runs `ingredientRowArraySchema.safeParse(words)` (Zod) to validate and extract typed values.
3. Calls `splitIngredientDisplay(input)` to get the raw display substrings (preserving spacing).
4. Returns a `NormalizedIngredient` — with errors populated if validation failed.

`splitIngredientDisplay` walks the raw input character-by-character using word lengths to find exact section boundaries, including trailing spaces. It correctly handles the two-word fraction amount case (`"1 1/2 cups flour"` → amount display `"1 1/2 "`, unit display `"cups "`, name display `"flour"`).

---

### Store — ingredient state

Ingredients are stored in Zustand (in `apps/ui/src/stores/recipeStore.ts`) as a flat record keyed by generated IDs:

```ts
ingredients: Record<string, NormalizedIngredient>
```

IDs are generated when a recipe is normalized on load (e.g. `"ing-step-{recipeId}-{stepId}-{index}"`).

**Store actions for ingredient updates:**

| Action | What it does |
|---|---|
| `updateIngredient(id, rawString)` | Re-parses the full raw string via `parseIngredientString` and replaces the whole entry |
| `updateIngredientAmount(id, amountDisplay)` | Calls `updateIngredientAmountField` — re-parses just the amount, preserves unit/name |
| `updateIngredientMeasurementUnit(id, unit)` | Calls `updateIngredientUnitField` — sets unit value and display (adds trailing space) |
| `updateIngredientName(id, name)` | Calls `updateIngredientNameField` — sets name value and display |

`updateIngredient` (full re-parse) is used for keyboard typing. The field-specific actions are used by the dropdown buttons, which only touch one section at a time.

---

### `IngredientRow` — the parent component

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientRow.tsx`.

This is the top-level ingredient component. It renders:
- A `<textarea>` (rows=1, so it behaves like an `<input>`) that holds the full raw string.
- An `IngredientDropdown` overlay (only when the field is focused and valid).
- An `IngredientRowProvider` that passes context down to the dropdown sub-components.

Key behaviors:
- `handleInput` routes `insertText` and `deleteContentBackward` events to `updateIngredient` (full re-parse). Paste is handled separately via `handleOnPaste`.
- `_determineDropdownMode` reads the caret's column position to decide which dropdown panel to show (`"amount"`, `"measurement"`, or `"name"`). Column 0 = amount; column 1 = measurement (unless a fraction is present, in which case column 1 is still amount and column 2 is measurement); column 2+ = name.
- `caretIndexRef` stores the desired caret position after a store update. A `useLayoutEffect` restores it on the next render so the cursor doesn't jump to the end when the textarea re-renders.

---

### `IngredientDropdown` — the sliding panel

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientDropdown.tsx`.

Contains three panels laid out in a flex row: `IngredientAmountDropdown`, `IngredientMeasurementDropdown`, `IngredientNameDropdown`. A CSS `translateX` transform slides between them based on `dropdownMode`. Navigation `< prev` / `next >` buttons allow switching between panels.

The dropdown positions itself absolutely, above the textarea on small screens and below on md+.

---

### `IngredientAmountDropdown` — fraction preset buttons

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientAmountDropdown.tsx`.

This is **not** a numeric keypad. It presents **six fraction preset buttons**: `1/2`, `1/3`, `2/3`, `1/4`, `3/4`, `1/8`. The user can still type any value via keyboard — the presets are a convenience shortcut.

**Preset click logic (`handleFractionPreset`):**

The current `amountDisplay` is analyzed to detect a whole-number part and a fraction part:

| Current display | Click `"1/4"` | Result |
|---|---|---|
| `""` (empty) | → | `"1/4"` |
| `"2"` (whole via keyboard) | → | `"2 1/4"` |
| `"1/3"` (pure fraction) | → | `"1/4"` |
| `"2 1/3"` (mixed) | → | `"2 1/4"` |
| `"2.5"` (decimal) | → | buttons disabled |

**Toggle behavior:** Clicking the already-active preset clears just the fraction part. `"1/4"` → `""`, `"2 1/4"` → `"2"`.

**Active state:** The button matching the current fraction part renders with `bg-background text-text font-semibold`.

**Disabled state:** All preset buttons are disabled (`text-text/25`) when the display contains a decimal point, since fractions and decimals are mutually exclusive.

**Reset button:** A full-width `"Reset"` button below the presets calls `onAmountChange('', 0)`, clearing the entire amount including anything the user typed via keyboard.

After any preset or reset click, `caretIndex` is set to `newDisplay.length` (end of string).

---

### `IngredientMeasurementDropdown` — unit selector

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientMeasurementDropdown.tsx`.

Renders a grid of all measurement unit abbreviations from `measurementUnitsAbbreviated` (in `apps/ui/src/utils/measurements.ts`). Clicking one calls `onMeasurementChange(unit)` → `updateIngredientMeasurementUnit` in the store. The store helper appends a trailing space to the unit display so the next section starts correctly.

---

### `IngredientNameDropdown` — autocomplete

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientNameDropdown.tsx`.

Watches `ingredient.name.display` and debounces it into an API autocomplete call via `useDebouncedApi`. Renders a suggestion list. Clicking a suggestion calls `onNameClick(name)` → `updateIngredientName` in the store.

---

### `IngredientRowProvider` — context bridge

Located at `apps/ui/src/components/recipeInput/ingredient/IngredientRowProvider.tsx`.

Passes the current `NormalizedIngredient`, `caretIndex`, `dropdownMode`, and all change callbacks from `IngredientRow` down to the three dropdown sub-components via React context. All dropdown components consume this via `useIngredientRow()`.
