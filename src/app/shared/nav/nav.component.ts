import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { UsersProvider } from '../../gateways/ports/users.provider';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  readonly #usersProvider = inject(UsersProvider);
  readonly #router = inject(Router);
  currentUser = this.#usersProvider.currentUser;
  role = this.#usersProvider.role;

  onDisconnect() {
    this.#usersProvider.logout();
    this.#router.navigate(['/']);
  }
}
