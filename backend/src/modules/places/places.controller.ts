import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetPlacesInBoundsDto } from './dto/get-places-in-bounds.dto';
import { GetPlacesNearbyDto } from './dto/get-places-nearby.dto';
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

  @Get(':id')
  getPlaceById(@Param('id') id: string) {
    return this.placesService.getPlaceById(id);
  }
}
