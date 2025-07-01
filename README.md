# Recipes app

This is a Turborepo that has a Postgres DB, NestJS backend, and NextJs frontend. A social-media type app for recipes

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

- MacOS:
  1. brew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
  2. `brew install docker`
  3. `brew install colima`
  4. `brew services start colima` 
  5. `colima start`
  6. `npm install -g pnpm@10.11.0`
  7. `pnpm setup` You may have to restart your terminal after this
  8. `pnpm add turbo --global`
  9. `pnpm i`
  10. `docker compose up -d`

### Running locally:

1. create your .env files
2. run `turbo build`
3. run `turbo dev`

website should be located at: [http://localhost:3000](http://localhost:3000)
server should be located at: http://localhost:3001

## Run tests:

1. run `turbo test`
