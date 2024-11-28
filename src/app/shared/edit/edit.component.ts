import { Component, inject, input } from '@angular/core';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #router = inject(Router);
  task = input.required<Task>();

  onMyTaskPage = input<boolean>(this.#router.url === '/my-tasks');
  currentUser = this.#usersProvider.currentUser;
}
