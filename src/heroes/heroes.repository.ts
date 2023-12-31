import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HeroEntity } from './entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroesRepository {
  constructor(
    @InjectRepository(HeroEntity)
    private readonly heroRepository: Repository<HeroEntity>,
  ) {}

  async create(createHeroDto: CreateHeroDto): Promise<HeroEntity> {
    const hero = this.heroRepository.create(createHeroDto);
    return await this.heroRepository.save(hero);
  }

  async findAll(): Promise<HeroEntity[]> {
    return await this.heroRepository.find();
  }

  async findOne(id: number): Promise<HeroEntity | undefined> {
    return await this.heroRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateHeroDto: UpdateHeroDto,
  ): Promise<HeroEntity | undefined> {
    const hero = await this.heroRepository.findOne({ where: { id } });
    if (!hero) {
      return undefined;
    }

    Object.assign(hero, updateHeroDto);
    return await this.heroRepository.save(hero);
  }

  async remove(id: number): Promise<void> {
    await this.heroRepository.delete(id);
  }
}
