import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    const url = new URL(dbUrl);
    const host = url.hostname || 'localhost';
    const port = url.port ? parseInt(url.port, 10) : 3306;
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

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}