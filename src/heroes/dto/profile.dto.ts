import { IsNumber } from 'class-validator';

export class ProfileDto {
  @IsNumber()
  readonly str: number;

  @IsNumber()
  readonly int: number;

  @IsNumber()
  readonly agi: number;

  @IsNumber()
  readonly luk: number;
}
