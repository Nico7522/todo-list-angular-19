import { Component, computed, inject, input, signal } from '@angular/core';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { Priority } from '../../enums/priority.enum';
import { PriorityComponent } from '../../shared/priority/priority.component';

@Component({
  selector: 'app-todo-details',
  imports: [AsyncPipe, PriorityComponent],
  templateUrl: './todo-details.component.html',
  styleUrl: './todo-details.component.scss',
})
export class TodoDetailsComponent {
  #tasksProvider = inject(FakeTasksProvider);
  readonly id = input<string>('');
  priorityColorClass = signal('');
  task$ = toObservable(this.id).pipe(
    switchMap((id) => {
      return of({
        userId: 100,
        id: 22,
        title: 'Ranger la chambre',
        completed: true,
        priority: Priority.HIGH,
        imgUrl: 'rangement.jpg',
      });

      // this.#tasksProvider.getTask(id);
    }),
    map((v) => {
      let color =
        v.priority === Priority.HIGH
          ? 'text-red-500'
          : v.priority === Priority.MEDIUM
          ? 'text-orange-500'
          : 'text-green-500';

      this.priorityColorClass.set(color);
      return v;
    })
  );

  ngOnInit() {}
}
