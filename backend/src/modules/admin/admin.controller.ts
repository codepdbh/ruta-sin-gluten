import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReviewSuggestionDto } from './dto/review-suggestion.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('verification/pending')
  getPendingVerifications() {
    return this.adminService.getPendingVerifications();
  }

  @Patch('verification/:id')
  reviewVerification(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: ReviewVerificationDto,
  ) {
    return this.adminService.reviewVerification(id, user.sub, dto);
  }

  @Get('suggestions/pending')
  getPendingSuggestions() {
    return this.adminService.getPendingSuggestions();
  }

  @Patch('suggestions/:id')
  reviewSuggestion(@Param('id') id: string, @Body() dto: ReviewSuggestionDto) {
    return this.adminService.reviewSuggestion(id, dto);
  }
}
