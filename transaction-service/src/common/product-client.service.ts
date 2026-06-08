import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductClientService {
  private productServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get<string>('PRODUCT_SERVICE_URL') || 'http://localhost:3002';
  }

  async getProduct(productId: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${productId}`)
      );
      return response.data.data; 
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Product with ID ${productId} not found in catalog.`);
      }
      throw new BadRequestException('Failed to communicate with Product Service.');
    }
  }

  async reduceProductStock(productId: number, quantity: number, authHeader: string) {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.productServiceUrl}/admin/products/${productId}/reduce`,
          { quantity },
          { headers: { Authorization: authHeader } }
        )
      );
    } catch (error) {
      throw new BadRequestException(`Failed to reduce stock for Product ID ${productId}. It may be out of stock.`);
    }
  }
}