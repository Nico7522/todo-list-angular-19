import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseTaskFormComponent } from './base-task-form.component';

describe('BaseTaskFormComponent', () => {
  let component: BaseTaskFormComponent;
  let fixture: ComponentFixture<BaseTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseTaskFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
