import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule], // Injects the ProductClientService
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}