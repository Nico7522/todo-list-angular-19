import { Component, inject } from '@angular/core';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { TaskComponent } from '../../../shared/task/task.component';

@Component({
  selector: 'app-my-tasks',
  imports: [AsyncPipe, TaskComponent],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
})
export class MyTasksComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #usersProvider = inject(FakeUsersProvider);

  currentUser = this.#usersProvider.currentUser;
  tasks$ = this.#tasksProvider.getTasksByUserId(this.currentUser()?.id || 0);
}
