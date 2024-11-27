import { Component, inject } from '@angular/core';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #usersProvider = inject(FakeUsersProvider);
  #router = inject(Router);
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
    this.#router.navigate(['/tasks']);
  }
}
