# Recipes app

This is a Turborepo that has a Postgres DB, NestJS backend, and Next.js frontend. A social-media type app for recipes

## Getting Started

### Setup:

NodeJS: [https://nodejs.org/en/download](https://nodejs.org/en/download)

- Windows:

  1. Get Docker Desktop
  2. Start Docker Engine
  3. `npm install -g pnpm@10.11.0`
  4. `pnpm setup` You may have to restart your terminal after this
  5. `pnpm add turbo --global`
  6. `pnpm i`
  7. Install python
  8. `python -m pip install localstack`
  9. `pip install awslocal`
  10. Add awslocal bin to PATH if it was not automatic
  11. Install docker compose
  12. `docker-compose up -d`

- MacOS:

  1. brew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
  2. `brew install docker`
  <!-- Colima is not working with my jest and/or TestContainer setup. Using Docker Desktop for now
       3. `brew install colima`
       4. `brew services start colima`
       5. `colima start --runtime docker` -->
  3. Get Docker Desktop
  4. Start Docker Engine
  5. `brew install localstack/tap/localstack-cli`
  6. Install python
  7. `pip install awslocal`
  8. Add awslocal bin to PATH if it was not automatic
  9. `npm install -g pnpm@10.11.0`
  10. `pnpm setup` You may have to restart your terminal after this
  11. `pnpm add turbo --global`
  12. `pnpm i`
  13. `docker-compose up -d`

### Running locally:

1. create your .env files:

   - `cp apps/api/.env.sample apps/api/.env`
   - `cp apps/api-image-processor/.env.sample apps/api-image-processor/.env`
   - `cp apps/ui/.env.sample apps/ui/.env`
   - `cp packages/database/.env.sample packages/database/.env`

2. run `turbo build`
3. if you want to add example data to db:
   - `cd packages/database`
   - `pnpm db:migrate`
4. run `turbo dev`

website should be located at: [http://localhost:3000](http://localhost:3000)
server should be located at: http://localhost:3001

## Run tests:

1. run `turbo test`
