import { Component, inject, input } from '@angular/core';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, shareReplay, switchMap } from 'rxjs';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { PriorityComponent } from '../../../shared/priority/priority.component';

@Component({
  selector: 'app-user-details',
  imports: [AsyncPipe, PriorityComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #tasksProvider = inject(FakeTasksProvider);
  id = input.required<number>();

  user$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#usersProvider.getUser(id);
    }),
    shareReplay()
  );
  tasks$ = this.user$.pipe(
    switchMap((user) => {
      if (user) return this.#tasksProvider.getTasksByUserId(user?.id);

      return of(null);
    })
  );
}
