export default {
  recipes: {
    output: {
      mode: 'tags-split',
      target: './src/recipesApi.ts',
      schemas: './src/model',
      client: 'react-query',
      mock: true,
      override: {
        mutator: {
          path: './src/custom-instance.ts',
          name: 'customInstance',
        }
      }
    },
    input: {
      target: './swagger.json',
    },
  },
};