import { Component, inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-base-task-form',
  imports: [ReactiveFormsModule],
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

  parentContainer = inject(ControlContainer);

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
        priorities: new FormControl(3, {
          nonNullable: true,
          validators: [Validators.required, this.propertyValidator()],
        }),
      })
    );
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
}
