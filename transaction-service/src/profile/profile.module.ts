import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
