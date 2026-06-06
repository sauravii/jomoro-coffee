import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const authUrl = this.configService.get<string>('AUTH_SERVICE_URL');
    const productUrl = this.configService.get<string>('PRODUCT_SERVICE_URL');
    const transactionUrl = this.configService.get<string>('TRANSACTION_SERVICE_URL');

    // 1. Route /auth/* to the Auth Service
    consumer
      .apply(createProxyMiddleware({ target: authUrl, changeOrigin: true }) as any)
      .forRoutes({ path: 'auth/*', method: RequestMethod.ALL });

    // 2. Route /products/* and /categories/* to the Product Service
    consumer
      .apply(createProxyMiddleware({ target: productUrl, changeOrigin: true }) as any)
      .forRoutes(
        { path: 'products', method: RequestMethod.ALL },
        { path: 'products/*', method: RequestMethod.ALL },
        { path: 'categories', method: RequestMethod.ALL },
        { path: 'categories/*', method: RequestMethod.ALL },
        { path: 'admin/products/*', method: RequestMethod.ALL }
      );

    // 3. Route /cart/* and /orders/* to the Transaction Service
    consumer
      .apply(createProxyMiddleware({ target: transactionUrl, changeOrigin: true }) as any)
      .forRoutes(
        { path: 'cart', method: RequestMethod.ALL },
        { path: 'cart/*', method: RequestMethod.ALL },
        { path: 'orders', method: RequestMethod.ALL },
        { path: 'orders/*', method: RequestMethod.ALL }
      );
  }
}