import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommonModule } from '../common/common.module';
import { ProductClientService } from '../common/product-client.service';

@Module({
  imports: [CommonModule],
  controllers: [OrderController],
  providers: [OrderService, ProductClientService],
})
export class OrderModule {}