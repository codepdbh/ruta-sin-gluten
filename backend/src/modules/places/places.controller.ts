import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetPlacesInBoundsDto } from './dto/get-places-in-bounds.dto';
import { GetPlacesNearbyDto } from './dto/get-places-nearby.dto';
import { RatePlaceDto } from './dto/rate-place.dto';
import { PlacesService } from './places.service';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('in-bounds')
  getPlacesInBounds(@Query() query: GetPlacesInBoundsDto) {
    return this.placesService.getPlacesInBounds(query);
  }

  @Get('nearby')
  getPlacesNearby(@Query() query: GetPlacesNearbyDto) {
    return this.placesService.getPlacesNearby(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/rating/me')
  getMyPlaceRating(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.placesService.getMyPlaceRating(id, user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/rating')
  ratePlace(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: RatePlaceDto,
  ) {
    return this.placesService.ratePlace(id, user.sub, dto);
  }

  @Get(':id')
  getPlaceById(@Param('id') id: string) {
    return this.placesService.getPlaceById(id);
  }
}
