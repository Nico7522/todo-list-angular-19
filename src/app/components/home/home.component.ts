import { Component, inject, signal } from '@angular/core';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { Router } from '@angular/router';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #tasksProvider = inject(FakeTasksProvider);

  readonly #router = inject(Router);
  users = this.#usersProvider.getUsers();
  role = this.#usersProvider.role;
  username = this.#usersProvider.username;

  onRoleChange(value: 'admin' | 'user') {
    this.#usersProvider.setRole(value);
  }

  onUsernameChange(username: string) {
    console.log(this.username());

    this.#usersProvider.setUsername(username.toLowerCase());
  }

  onStart() {
    this.#usersProvider.createUser(this.username());
    this.#usersProvider.setShowMenu(true);
    this.#tasksProvider.getRandomTasks();
    this.#router.navigate(['/tasks']);
  }

  showMessage = signal(false);
  show() {
    this.showMessage.set(!this.showMessage());
  }
}
