import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { HeroesRepository } from './heroes.repository';
import { RedisService } from '@shared/redis/service/redis.service';

@Injectable()
export class HeroesService {
  constructor(
    private readonly heroesRepository: HeroesRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createHeroDto: CreateHeroDto) {
    try {
      const createdHero = await this.heroesRepository.create(createHeroDto);
      await this.redisService.saveHero(createdHero.id, createdHero);
      return createdHero;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create hero.');
    }
  }

  async findAll() {
    try {
      return await this.heroesRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch heroes.');
    }
  }

  async findOne(id: number) {
    try {
      const heroFromRedis = await this.redisService.getHero(id);
      if (heroFromRedis) {
        return heroFromRedis;
      }
      const heroFromDB = await this.heroesRepository.findOne(id);
      return heroFromDB;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch hero.');
    }
  }

  async update(id: number, updateHeroDto: UpdateHeroDto) {
    try {
      const updatedHero = await this.heroesRepository.update(id, updateHeroDto);
      if (updatedHero) {
        await this.redisService.saveHero(id, updatedHero);
      }
      return updatedHero;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update hero.');
    }
  }

  async remove(id: number) {
    try {
      await this.heroesRepository.remove(id);
      await this.redisService.deleteHero(id);
      return `This action removes a #${id} hero`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove hero.');
    }
  }
}
