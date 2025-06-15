# Recipes database

This is a Postgres DB that uses Prisma to generate its client

## Getting Started

build locally:

1. create your .env files
2. run `pnpm i`
3. run `pnpm build`

To migrate:

- run `pnpm migrate`

To reset:

- run `npx prisma migrate reset`

To run seed alone:

- run `npx prisma db seed`
