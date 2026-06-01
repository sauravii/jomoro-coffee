import { Injectable } from '@nestjs/common';

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable()
export class ProductClientService {
  private readonly baseUrl = process.env.PRODUCT_SERVICE_URL;

  async getProductById(id: number): Promise<ProductDetail | null> {
    // MOCK — ganti ke real fetch setelah product-service siap
    return {
      id,
      name: `Mock Product ${id}`,
      price: 50000,
      stock: 10,
    };
  }

  async reduceStock(id: number, quantity: number): Promise<void> {
    // MOCK — ganti ke real fetch setelah product-service siap
    console.log(`Mock: reduce stock product ${id} by ${quantity}`);
  }
}