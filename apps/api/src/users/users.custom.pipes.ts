import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PatchUserDto } from './contracts';

@Injectable()
export class PatchDtoValidationPipe implements PipeTransform {
  transform(value: PatchUserDto) {
    if (value.customDailyNutrition && value.predefinedDailyNutritionId)
      throw new BadRequestException(
        'Only customDailyNutrition or predefinedDailyNutritionId can be provided; not both',
      );
    else return value;
  }
}
