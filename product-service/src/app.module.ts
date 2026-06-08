import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma/prisma.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';

import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { ReduceController } from './admin/reduce.controller';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
  ],
  controllers: [CategoryController, ProductController, AdminController, ReduceController],
  providers: [JwtStrategy, CategoryService, ProductService, AdminService], 
})
export class AppModule {}