import { Component, inject, Input, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  catchError,
  EMPTY,
  map,
  shareReplay,
  Subject,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs';
import { FakeTasksProvider } from '../../gateways/adapters/fake-tasks.provider';
import { Priority } from '../../enums/priority.enum';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent {
  readonly #tasksProvider = inject(FakeTasksProvider);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  id = input.required<string>();
  taskId$ = toObservable(this.id);
  isTaskUpdated = signal(false);
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
    let completed = this.editForm.get('status')?.value === 'true';
    let task = { ...this.editForm.value, completed };
    this.#tasksProvider
      .edit(+this.id(), task as Partial<Task>)
      .pipe(
        take(1),
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe((response) => {
        this.isTaskUpdated.set(true);
        setTimeout(() => {
          if (response) this.#router.navigate(['/task', this.id()]);
        }, 2000);
      });
  }

  editForm = this.#formBuilder.group({
    title: ['', Validators.required],
    priorities: [Priority.HIGH, Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit() {}
}
