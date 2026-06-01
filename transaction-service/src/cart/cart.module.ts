import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CommonModule } from '../common/common.module';
import { ProductClientService } from '../common/product-client.service';

@Module({
  imports: [CommonModule],
  controllers: [CartController],
  providers: [CartService, ProductClientService],
})
export class CartModule {}