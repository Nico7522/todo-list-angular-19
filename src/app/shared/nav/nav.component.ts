import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  #usersProvider = inject(FakeUsersProvider);
  #router = inject(Router);
  canShowMenu = this.#usersProvider.showMenu;
  selectedUser = this.#usersProvider.username;
  hideMenu() {
    this.#usersProvider.setUsername('');
    this.#usersProvider.setRole(null);
    this.#usersProvider.setShowMenu(false);
  }

  onDisconnect() {
    this.#usersProvider.logout();
    this.#router.navigate(['/']);
  }
}
