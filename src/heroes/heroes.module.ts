import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { HeroesRepository } from './heroes.repository';
import { HeroEntity } from './entities/hero.entity';
import { RedisService } from '@shared/redis/service/redis.service';
import { RedisRepository } from '@shared/redis/repository/redis.repository';
import { RedisModule } from '@shared/redis/redis.module';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([HeroEntity])],
  controllers: [HeroesController],
  providers: [RedisService, RedisRepository, HeroesService, HeroesRepository],
})
export class HeroesModule {}
