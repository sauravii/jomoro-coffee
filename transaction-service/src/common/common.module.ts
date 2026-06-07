import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProductClientService } from './product-client.service';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthClientService } from './auth-client.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    HttpModule, // Required for ProductClientService to make HTTP requests
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jomoro_secret_key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtStrategy, ProductClientService, JwtAuthGuard, RolesGuard, AuthClientService],
  exports: [PassportModule, JwtModule, JwtStrategy, ProductClientService, HttpModule, JwtAuthGuard, RolesGuard, AuthClientService], // Exporting makes them available globally
})
export class CommonModule {}