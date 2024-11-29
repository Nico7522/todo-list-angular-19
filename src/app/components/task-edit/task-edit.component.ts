import { Component, inject, Input, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #formBuilder = inject(FormBuilder);
  id = input.required<string>();
  taskId$ = toObservable(this.id);

  task = toSignal(
    this.taskId$.pipe(
      switchMap((id) => {
        return this.#tasksProvider.getTask(id).pipe(
          map((task) => {
            if (task) {
              this.editForm.get('title')?.patchValue(task.title);
              this.editForm.get('priorities')?.patchValue(task.priority);
              this.editForm
                .get('status')
                ?.patchValue(task.completed ? 'true' : 'false');
            }
          })
        );
      })
    )
  );

  onSubmit() {
    console.log(this.editForm.value);
    this.#tasksProvider
      .edit(+this.id(), this.editForm.value as Partial<Task>)
      .subscribe();
  }

  editForm = this.#formBuilder.group({
    title: ['', Validators.required],
    priorities: [Priority.HIGH, Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit() {}
}
