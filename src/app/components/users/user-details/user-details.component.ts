import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, shareReplay, switchMap, tap } from 'rxjs';
import { PriorityComponent } from '../../../shared/priority/priority.component';
import { UsersProvider } from '../../../gateways/ports/users.provider';
import { TasksProvider } from '../../../gateways/ports/tasks.provider';

@Component({
  selector: 'app-user-details',
  imports: [AsyncPipe, PriorityComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  readonly #usersProvider = inject(UsersProvider);
  readonly #tasksProvider = inject(TasksProvider);
  destroyRef = inject(DestroyRef);
  id = input.required<string>();
  gender = signal('');
  user$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#usersProvider
        .getUser(id)
        .pipe(
          tap((user) =>
            this.gender.set(user?.gender === 'female' ? 'Femme' : 'Homme')
          )
        );
    }),
    shareReplay()
  );
  tasks$ = this.user$.pipe(
    tap((_) =>
      window.scrollTo(0, window.document.body.scrollHeight - window.innerHeight)
    ),
    switchMap((user) => {
      if (user) return this.#tasksProvider.getTasksByUserId(user?.id);

      return of(null);
    })
  );
}
