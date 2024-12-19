import { Component, inject, signal } from '@angular/core';
import { FakeUsersProvider } from '../../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { UserDetailsComponent } from '../../../../components/users/user-details/user-details.component';
import { UserEditComponent } from '../../../../components/users/user-edit/user-edit.component';
type Action = {
  show: boolean;
  id?: number;
  action: 'edit' | 'details' | 'create';
};

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, UserDetailsComponent, UserEditComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  readonly #usersProvider = inject(FakeUsersProvider);

  users$ = this.#usersProvider.getUsers();
  action = signal<Action>({ show: false, id: 0, action: 'details' });
  showDetails(id: number) {
    this.action.set({ show: true, id, action: 'details' });
  }

  showEditForm(id: number) {
    this.action.set({ show: true, id, action: 'edit' });
  }

  showCreateForm() {}
}
