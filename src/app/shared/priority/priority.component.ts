import { Component, input } from '@angular/core';
import { Priority } from '../../enums/priority.enum';
import { PriorityPipe } from '../../pipes/priority.pipe';

@Component({
  selector: 'app-priority',
  imports: [PriorityPipe],
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
})
export class PriorityComponent {
  readonly priority = input<Priority>();

  get priorityEnum() {
    return Priority;
  }
}
