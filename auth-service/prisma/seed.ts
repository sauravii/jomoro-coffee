import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const url = new URL(dbUrl);
const host = url.hostname || 'localhost';
const port = url.port ? parseInt(url.port, 10) : 3308;
const user = decodeURIComponent(url.username || 'root');
const password = decodeURIComponent(url.password || '');
const database = url.pathname ? url.pathname.replace(/^\//, '') : '';

const adapter = new PrismaMariaDb({
  host,
  port,
  user,
  password,
  database,
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jomoro.com' },
    update: {},
    create: {
      first_name: 'Admin',
      last_name: 'Jomoro',
      email: 'admin@jomoro.com',
      password: 'admin12345',
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });