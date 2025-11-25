import type {
  MeasurementFormat,
  NumberFormat,
  NutritionalFactsResponse,
  PatchUserDto,
  UiTheme,
  UserAccountResponse,
} from '@repo/codegen/model';
import { usersControllerUpdateUserAccountV1 } from '@repo/codegen/users';
import { nutritionalFactsConst } from '@src/utils/nutritionalFacts';
import { createStore } from 'zustand/vanilla';

export type UserState = Omit<
  UserAccountResponse,
  'createdAt' | 'updatedAt' | 'diet'
> & { _isCustomDailyNutrition: boolean };

export type UserActions = {
  setNumberFormat: (_value: NumberFormat) => Promise<void>;
  setMeasurementFormat: (_value: MeasurementFormat) => Promise<void>;
  setUiTheme: (_value: UiTheme) => Promise<void>;
  setHandle: (_value: string) => Promise<void>;
  setUseGuest: () => void;
  setPredefinedNutritionalFacts: (_id: string, _name: string) => void;
  setPartialCustomNutritionalFacts: (
    _value: Partial<UserAccountResponse['customDailyNutrition']>,
  ) => void;
  makeDailyNurtitionUserAccountDto: () => Pick<
    PatchUserDto,
    'customDailyNutrition' | 'predefinedDailyNutritionId'
  >;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
  id: '',
  email: '',
  name: '',
  handle: '',
  numberFormat: 'default',
  measurementFormat: 'default',
  uiTheme: 'system',
  imageUrl: '',
  preferedDiets: [],
  predefinedDailyNutrition: null,
  customDailyNutrition: null,
  _isCustomDailyNutrition: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set, get) => ({
    ...initState,
    _isCustomDailyNutrition: Boolean(initState.customDailyNutrition?.id),
    setNumberFormat: async (numberFormat: NumberFormat) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserAccountV1({ numberFormat });
      } else {
        localStorage.setItem('numberFormat', numberFormat);
      }
      set(() => ({ numberFormat }));
    },
    setMeasurementFormat: async (measurementFormat: MeasurementFormat) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserAccountV1({ measurementFormat });
      } else {
        localStorage.setItem('measurementFormat', measurementFormat);
      }
      set(() => ({ measurementFormat }));
    },
    setUiTheme: async (uiTheme: UiTheme) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserAccountV1({ uiTheme });
      } else {
        localStorage.setItem('uiTheme', uiTheme);
      }
      set(() => ({ uiTheme }));
    },
    setHandle: async (handle: string) => {
      const id = get().id;
      if (id) {
        await usersControllerUpdateUserAccountV1({ handle });
      }
      set(() => ({ handle }));
    },
    setUseGuest: () => {
      localStorage.clear();
    },
    setPredefinedNutritionalFacts: (_id: string, _name: string) =>
      set(() => {
        // todo call api to get predefined nutritional facts, we just store the id and name here
        return {
          predefinedDailyNutrition: {
            id: _id,
            name: _name,
            nutritionalFacts: {} as NutritionalFactsResponse,
          },
          _isCustomDailyNutrition: false,
        };
      }),
    setPartialCustomNutritionalFacts: (
      partial: Partial<UserAccountResponse['customDailyNutrition']>,
    ) =>
      set((state) => {
        const merged = {
          ...nutritionalFactsConst,
          ...(state.customDailyNutrition ?? {}),
          ...partial,
        } as UserAccountResponse['customDailyNutrition'];

        return { customDailyNutrition: merged, _isCustomDailyNutrition: true };
      }),
    makeDailyNurtitionUserAccountDto: () => {
      const isCustomDailyNutrition = get()._isCustomDailyNutrition;
      return {
        predefinedDailyNutritionId: !isCustomDailyNutrition
          ? get().predefinedDailyNutrition?.id
          : undefined,
        customDailyNutrition: isCustomDailyNutrition
          ? get().customDailyNutrition
          : null,
      };
    },
  }));
};
