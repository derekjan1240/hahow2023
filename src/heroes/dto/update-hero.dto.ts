import {
  IsString,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class UpdateHeroDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  readonly profile: ProfileDto;
}
