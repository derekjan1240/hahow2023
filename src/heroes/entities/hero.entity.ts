import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('heroes')
export class HeroEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column('json')
  profile: {
    str: number;
    int: number;
    agi: number;
    luk: number;
  };

  constructor(partial: Partial<HeroEntity>) {
    Object.assign(this, partial);
  }
}
