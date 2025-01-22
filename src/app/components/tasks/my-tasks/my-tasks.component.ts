import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TaskComponent } from '../../../shared/task/task.component';
import { UsersProvider } from '../../../gateways/ports/users.provider';
import { TasksProvider } from '../../../gateways/ports/tasks.provider';

@Component({
  selector: 'app-my-tasks',
  imports: [AsyncPipe, TaskComponent],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
})
export class MyTasksComponent {
  readonly #tasksProvider = inject(TasksProvider);
  readonly #usersProvider = inject(UsersProvider);

  currentUser = this.#usersProvider.currentUser;
  tasks$ = this.#tasksProvider.getTasksByUserId(this.currentUser()?.id || '');
}
