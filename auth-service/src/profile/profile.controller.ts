import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiExcludeController()
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CUSTOMER')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return this.profileService.getProfile(req.user.id);
  }
}