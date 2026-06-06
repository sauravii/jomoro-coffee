import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { CartModule } from './cart/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    // This must be initialized and set to global so all other modules 
    // (like CommonModule and PrismaModule) can access the .env configurations safely
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule, 
    CartModule, 
    PrismaModule, 
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}