import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule], // CommonModule provides ProductClientService automatically now
  controllers: [CartController],
  providers: [CartService], 
})
export class CartModule {}