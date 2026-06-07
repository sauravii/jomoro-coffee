import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthClientService } from '../common/auth-client.service';
import { JwtAuthGuard } from '../common/guards/jwt.auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/role.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class ProfileController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Get()
  @ApiOperation({ summary: '— get profile' })
  getProfile(@Headers('authorization') authHeader: string) {
    return this.authClientService.getProfile(authHeader);
  }
}
