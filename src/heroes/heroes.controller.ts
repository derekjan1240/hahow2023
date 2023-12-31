import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('heroes')
@ApiTags('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a hero' })
  @ApiResponse({
    status: 201,
    description: 'The hero has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input format or missing required fields.',
  })
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.heroesService.create(createHeroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all heroes' })
  @ApiResponse({ status: 200, description: 'Returns an array of heroes.' })
  findAll() {
    return this.heroesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hero by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the hero with the specified ID.',
  })
  @ApiNotFoundResponse({ description: 'Hero with the specified ID not found.' })
  findOne(@Param('id') id: string) {
    const heroId = +id;
    if (isNaN(heroId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.heroesService.findOne(heroId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hero by ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated hero.' })
  @ApiBadRequestResponse({
    description: 'Invalid input format or missing required fields.',
  })
  @ApiNotFoundResponse({ description: 'Hero with the specified ID not found.' })
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.heroesService.update(+id, updateHeroDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hero by ID' })
  @ApiResponse({
    status: 200,
    description: 'The hero has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Hero with the specified ID not found.' })
  remove(@Param('id') id: string) {
    const heroId = +id;
    if (isNaN(heroId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.heroesService.remove(heroId);
  }
}
