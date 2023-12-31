import { Inject, Injectable } from '@nestjs/common';

import { RedisRepository } from '../repository/redis.repository';
import { HeroEntity } from 'src/heroes/entities/hero.entity';

enum RedisPrefixEnum {
  HERO = 'hero',
}

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async saveHero(heroId: number, heroData: HeroEntity): Promise<void> {
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.HERO,
      heroId.toString(),
      JSON.stringify(heroData),
    );
  }

  async getHero(heroId: number): Promise<HeroEntity | null> {
    const hero = await this.redisRepository.get(
      RedisPrefixEnum.HERO,
      heroId.toString(),
    );
    return hero ? JSON.parse(hero) : null;
  }

  async deleteHero(heroId: number): Promise<void> {
    await this.redisRepository.delete(RedisPrefixEnum.HERO, heroId.toString());
  }
}
