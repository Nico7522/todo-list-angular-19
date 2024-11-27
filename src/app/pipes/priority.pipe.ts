import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../enums/priority.enum';

@Pipe({
  name: 'priority',
})
export class PriorityPipe implements PipeTransform {
  transform(priority: Priority): string {
    let translation =
      priority === Priority.HIGH
        ? 'Haute'
        : priority === Priority.MEDIUM
        ? 'Moyenne'
        : 'Basse';
    return translation;
  }
}
