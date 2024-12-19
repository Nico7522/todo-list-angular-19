import { Component, inject, signal } from '@angular/core';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { UserDetailsComponent } from '../../../../components/users/user-details/user-details.component';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, UserDetailsComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  readonly #usersProvider = inject(FakeUsersProvider);

  users$ = this.#usersProvider.getUsers();
  showUserDetails = signal({ show: false, id: 0 });
  showDetails(id: number) {
    this.showUserDetails.set({ show: true, id });
  }

  showEditForm() {}

  showCreateForm() {}
}
