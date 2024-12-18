import { Component, inject, Input, output } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PrioritySelectComponent } from '../priority-select/priority-select.component';
import { Task } from '../../models/task.model';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-base-task-form',
  imports: [ReactiveFormsModule, PrioritySelectComponent],
  host: {
    class: 'w-full',
  },
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './base-task-form.component.html',
  styleUrl: './base-task-form.component.scss',
})
export class BaseTaskFormComponent {
  @Input({ required: true }) controlKey = '';
  @Input() label = '';
  @Input() task: Task | null = null;
  parentContainer = inject(ControlContainer);
  imgUrl = environment.IMG_URL;

  get parentFormGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit() {
    this.parentFormGroup.addControl(
      this.controlKey,
      new FormGroup({
        title: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        priorities: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        image: new FormControl(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
    );
    if (this.task) {
      this.parentFormGroup.get('base.title')?.patchValue(this.task.title);
      this.parentFormGroup
        .get('base.priorities')
        ?.patchValue(this.task.priority);
    }
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }

  propertyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (+value === 3) {
        return {
          wrongValue: true,
        };
      }

      return null;
    };
  }

  imageChange = output<FormData>();
  onImageChange(event: Event) {
    let eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files.length > 0) {
      const file = eventTarget.files[0];
      let formData = new FormData();
      formData.append('image', file, file.name);
      this.parentFormGroup.get('image')?.patchValue(file);

      this.imageChange.emit(formData);
    }
  }

  // ngAfterViewInit() {
  //   if (this.task) {
  //     this.parentFormGroup.get('title')?.patchValue(this.task.title);
  //   }
  // }
}
