import { Component, computed, inject, input, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, of, shareReplay, switchMap } from 'rxjs';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { Priority } from '../../enums/priority.enum';
import { PriorityComponent } from '../../shared/priority/priority.component';
import { FakeUsersProvider } from '../../gateways/adapters/fake-users.provider';

@Component({
  selector: 'app-task-details',
  imports: [AsyncPipe, PriorityComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  #tasksProvider = inject(FakeTasksProvider);
  #usersProvider = inject(FakeUsersProvider);
  readonly id = input<string>('');
  priorityColorClass = signal('');
  task$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return this.#tasksProvider.getTask(id);
    }),
    shareReplay()
  );

  user$ = this.task$.pipe(
    filter((t) => t !== null),
    switchMap((task) => {
      return this.#usersProvider.getUser(task.userId);
    })
  );

  ngOnInit() {}
}
