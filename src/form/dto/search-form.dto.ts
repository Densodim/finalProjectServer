import { IsString } from 'class-validator';

export class SearchFormDto {
  @IsString()
  query: string;
}
