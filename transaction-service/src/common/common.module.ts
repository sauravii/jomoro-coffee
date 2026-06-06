import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProductClientService } from './product-client.service';

@Module({
  imports: [
    PassportModule,
    HttpModule, // Required for ProductClientService to make HTTP requests
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jomoro_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, ProductClientService],
  exports: [JwtModule, JwtStrategy, ProductClientService, HttpModule], // Exporting makes them available globally
})
export class CommonModule {}