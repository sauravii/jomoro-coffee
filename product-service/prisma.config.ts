import { defineConfig } from 'prisma/config'; // or the specific builder utility your project uses

export default defineConfig({
  migrations: {
    seed: 'ts-node ./prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL, // Points to your MySQL connection string safely
  },
});