import { Component, inject, input, signal } from '@angular/core';
import { AsyncPipe, Location } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  filter,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { PriorityComponent } from '../../../shared/priority/priority.component';
import { FakeTasksProvider } from '../../../gateways/adapters/fake-tasks.provider';
import { FakeUsersProvider } from '../../../gateways/adapters/fake-users.provider';
import { environment } from '../../../../environments/environment.development';
import { CheckDateFormatPipe } from '../../../pipes/check-date-format.pipe';

@Component({
  selector: 'app-task-details',
  imports: [AsyncPipe, PriorityComponent, CheckDateFormatPipe],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #usersProvider = inject(FakeUsersProvider);
  readonly #location = inject(Location);
  readonly id = input<string>('');
  body = document.body;
  imgUrl = environment.IMG_URL;
  priorityColorClass = signal('');
  task$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#tasksProvider.getTask(id).pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
    }),
    shareReplay()
  );

  user$ = this.task$.pipe(
    filter((t) => t !== null),
    switchMap((task) => {
      if (task.userId) return this.#usersProvider.getUser(task.userId);
      return of(null);
    })
  );

  back() {
    this.#location.back();
  }

  ngOnInit() {}

  increaseSize = signal(false);
  zoomPicture() {
    this.increaseSize.set(!this.increaseSize());
    this.increaseSize()
      ? this.body.classList.add('overflow-hidden')
      : this.body.classList.remove('overflow-hidden');
  }
}
