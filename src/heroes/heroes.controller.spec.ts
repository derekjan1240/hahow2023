import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroesController } from './heroes.controller';
import { HeroesService } from './heroes.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { HeroEntity } from './entities/hero.entity';
import { HeroesRepository } from './heroes.repository';
import { RedisService } from '@shared/redis/service/redis.service';
import { RedisRepository } from '@shared/redis/repository/redis.repository';
import { RedisModule } from '@shared/redis/redis.module';

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  setWithExpiry: jest.fn(),
};

describe('HeroesController', () => {
  let controller: HeroesController;
  let heroesService: HeroesService;

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
      controllers: [HeroesController],
      providers: [
        { provide: RedisService, useValue: mockRedisService },
        RedisService,
        RedisRepository,
        HeroesService,
        HeroesRepository,
      ],
    }).compile();

    heroesService = moduleRef.get<HeroesService>(HeroesService);
    controller = moduleRef.get<HeroesController>(HeroesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a hero', async () => {
      const createHeroDto: CreateHeroDto = {
        name: 'Test Hero',
        image: 'test-image-url',
        profile: {
          str: 10,
          int: 8,
          agi: 5,
          luk: 7,
        },
      };

      const createdHero: HeroEntity = {
        id: 1,
        name: 'Test Hero',
        image: 'test-image-url',
        profile: {
          str: 10,
          int: 8,
          agi: 5,
          luk: 7,
        },
      };

      jest
        .spyOn(heroesService, 'create')
        .mockImplementation(() => Promise.resolve(createdHero));

      expect(await controller.create(createHeroDto)).toBe(createdHero);
      expect(heroesService.create).toHaveBeenCalledWith(createHeroDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of heroes', async () => {
      const heroes: HeroEntity[] = [
        {
          id: 1,
          name: 'Hero1',
          image: 'image1',
          profile: { str: 1, int: 2, agi: 3, luk: 4 },
        },
        {
          id: 2,
          name: 'Hero2',
          image: 'image2',
          profile: { str: 5, int: 6, agi: 7, luk: 8 },
        },
        {
          id: 3,
          name: 'Hero3',
          image: 'image3',
          profile: { str: 9, int: 10, agi: 11, luk: 12 },
        },
      ];

      jest
        .spyOn(heroesService, 'findAll')
        .mockImplementation(() => Promise.resolve(heroes));

      expect(await controller.findAll()).toEqual(heroes);
      expect(heroesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a hero by id', async () => {
      const heroId = '1';
      const hero: HeroEntity = {
        id: 1,
        name: 'Hero1',
        image: 'image1',
        profile: { str: 1, int: 2, agi: 3, luk: 4 },
      };

      jest
        .spyOn(heroesService, 'findOne')
        .mockImplementation(() => Promise.resolve(hero));

      expect(await controller.findOne(heroId)).toBe(hero);
      expect(heroesService.findOne).toHaveBeenCalledWith(+heroId);
    });
  });

  describe('update', () => {
    it('should update a hero by id', async () => {
      const heroId = '1';
      const updateHeroDto: UpdateHeroDto = {
        name: 'Updated Hero',
        image: 'updated-image-url',
        profile: {
          str: 8,
          int: 6,
          agi: 9,
          luk: 7,
        },
      };
      const hero: HeroEntity = {
        id: 1,
        name: 'Updated Hero',
        image: 'updated-image-url',
        profile: {
          str: 8,
          int: 6,
          agi: 9,
          luk: 7,
        },
      };

      jest
        .spyOn(heroesService, 'update')
        .mockImplementation(() => Promise.resolve(hero));

      expect(await controller.update(heroId, updateHeroDto)).toBe(hero);
      expect(heroesService.update).toHaveBeenCalledWith(+heroId, updateHeroDto);
    });
  });

  describe('remove', () => {
    it('should remove a hero by id', async () => {
      const heroId = '1';

      jest
        .spyOn(heroesService, 'remove')
        .mockImplementation(() => Promise.resolve('Removed Hero'));

      expect(await controller.remove(heroId)).toBe('Removed Hero');
      expect(heroesService.remove).toHaveBeenCalledWith(+heroId);
    });
  });
});
