import { Component, computed, input } from '@angular/core';
import { Task } from '../../models/task.model';
import { RouterModule } from '@angular/router';
import { Priority } from '../../enums/priority.enum';
import { PriorityComponent } from '../priority/priority.component';
import { EditComponent } from '../edit/edit.component';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-task',
  imports: [RouterModule, PriorityComponent, EditComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  task = input.required<Task>();
  imgUrl = environment.IMG_URL;
  priorityColorClass = computed(() =>
    this.task().priority === Priority.HIGH
      ? 'text-red-500'
      : this.task().priority === Priority.MEDIUM
      ? 'text-orange-500'
      : 'text-green-500'
  );
}
