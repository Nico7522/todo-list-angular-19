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
  currentUser = this.#usersProvider.currentUser;

  onDisconnect() {
    this.#usersProvider.logout();
    this.#router.navigate(['/']);
  }
}
