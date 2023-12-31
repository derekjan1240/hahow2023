import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroEntity } from './entities/hero.entity';
import { HeroesRepository } from './heroes.repository';
import { RedisRepository } from '@shared/redis/repository/redis.repository';
import { RedisModule } from '@shared/redis/redis.module';
import * as redisMock from 'redis-mock';
import { RedisService } from '@shared/redis/service/redis.service';

jest.mock('@shared/redis/redis.client.factory', () => ({
  redisClientFactory: {
    provide: 'RedisClient',
    useValue: redisMock.createClient(),
  },
}));

describe('HeroesService', () => {
  let service: HeroesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        RedisModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [HeroEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([HeroEntity]),
      ],
      providers: [
        RedisService,
        RedisRepository,
        HeroesService,
        HeroesRepository,
      ],
    }).compile();

    service = moduleRef.get<HeroesService>(HeroesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
