import { Pipe, PipeTransform } from '@angular/core';
import { returnDateToString } from '../helpers/functions';

@Pipe({
  name: 'checkDateFormat',
})
export class CheckDateFormatPipe implements PipeTransform {
  transform(date: string | Date): string {
    return returnDateToString(date);
  }
}
