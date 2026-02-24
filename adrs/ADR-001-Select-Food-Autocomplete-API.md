# Architecture Decision Record (ADR) - Selection of Food Autocomplete API

## Status

Proposed

## Context

We need to implement a food/ingredient/cooking autocomplete feature in our UI application. Several APIs offer food-related data, and we need to evaluate their pros and cons to make an informed decision.

## Options Evaluated

### 1. Whisk Autocomplete API

- **Pros:**
- Purpose-built for food/ingredient search.
- Clean autocomplete-focused endpoint.
- Structured JSON responses.
- Designed for UI search-as-you-type scenarios.
- Country/language support parameters.

- **Cons:**
  - Currently not taking new clients
  - Requires API key and authentication setup.
  - Free tier limits may restrict production scaling.
  - Commercial usage terms may require review.
  - External dependency on a specialized food data provider.
- **Risks**
  - Vendor lock-in if tightly coupled to data format.

### 2: Nutritionix Autocomplete API

- **Pros**
  - Strong food and ingredient coverage.

  - Includes both generic foods and branded items.

  - Well-documented API.

  - Free developer tier available.

  - Mature platform with stable infrastructure.

- **Cons**
  - May return branded products when only ingredients are desired.

  - Rate limits in free tier.

  - Heavier nutrition-focused payload than required for simple autocomplete.

- **Risks**
  - Data bias toward packaged/branded foods.

  - Licensing considerations for commercial use.

### 2. Spoonacular API

- **Pros:**
  - Comprehensive database with a wide variety of food items and ingredients.
  - Specific endpoint for ingredient autocomplete, which simplifies implementation.
  - Good documentation and community support.
  - Offers additional features like recipe search and nutritional information.
- **Cons:**
  - Limited number of free requests per day.
  - Requires an API key for access.

### 3. Edamam Food Database API

- **Pros:**
  - Extensive food database with detailed information on ingredients.
  - Good for nutritional data and recipe integration.
  - Offers a search endpoint that can be used for autocomplete.
- **Cons:**
  - The free tier has strict limitations on usage.
  - The autocomplete functionality is not as straightforward as others.

### 4. TheMealDB

- **Pros:**
  - Completely free to use with no API key required.
  - Large collection of meal recipes and associated ingredients.
  - Simple to implement with straightforward endpoints.
- **Cons:**
  - Not specifically designed for autocomplete; requires more handling for search functionality.
  - Limited in terms of ingredient-specific data compared to others.

### 5. FoodAPI

- **Pros:**
  - Simple and easy to use, with a focus on food-related data.
  - Free access with minimal restrictions.
- **Cons:**
  - Smaller database compared to Spoonacular and Edamam.
  - Limited features and endpoints for advanced queries.

## Decision

After evaluating the options, we have decided to use the **Spoonacular API** for the following reasons:

- It provides a dedicated autocomplete endpoint that meets our requirements directly.
- The extensive database ensures we have access to a wide variety of food items, enhancing user experience.
- The additional features available in the API can be beneficial for future enhancements of our application.

## Consequences

By choosing the Spoonacular API, we will need to manage API key usage and monitor our request limits. We will also need to integrate the API calls into our application efficiently, ensuring a smooth user experience during the autocomplete process.

## Date

February 24, 2026
