export default {
  recipes: {
    output: {
      mode: 'tags-split',
      target: './src/api',
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
      target: '../../apps/recipes-api/swagger.json',
    },
  },
};
