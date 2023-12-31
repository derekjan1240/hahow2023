import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';

export class CreateHeroDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly image: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  readonly profile: ProfileDto;
}
