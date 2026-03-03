import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDeliveryPointDto } from './dto/create-delivery-point.dto';
import { CreateMainLocationDto } from './dto/create-main-location.dto';
import { CreateSellerProfileDto } from './dto/create-seller-profile.dto';
import { CreateShippingAreaDto } from './dto/create-shipping-area.dto';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { SellersService } from './sellers.service';

@ApiTags('sellers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get('me')
  me(@CurrentUser() user: { sub: string }) {
    return this.sellersService.getOwnProfile(user.sub);
  }

  @Post('profile')
  createProfile(@CurrentUser() user: { sub: string }, @Body() dto: CreateSellerProfileDto) {
    return this.sellersService.createProfile(user.sub, dto);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: { sub: string }, @Body() dto: UpdateSellerProfileDto) {
    return this.sellersService.updateProfile(user.sub, dto);
  }

  @Post('main-location')
  createMainLocation(@CurrentUser() user: { sub: string }, @Body() dto: CreateMainLocationDto) {
    return this.sellersService.createMainLocation(user.sub, dto);
  }

  @Post('delivery-points')
  createDeliveryPoint(@CurrentUser() user: { sub: string }, @Body() dto: CreateDeliveryPointDto) {
    return this.sellersService.createDeliveryPoint(user.sub, dto);
  }

  @Post('shipping-areas')
  createShippingArea(@CurrentUser() user: { sub: string }, @Body() dto: CreateShippingAreaDto) {
    return this.sellersService.createShippingArea(user.sub, dto);
  }
}
