import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateotherprescriptionComponent } from './validateotherprescription.component';

describe('ValidateotherprescriptionComponent', () => {
  let component: ValidateotherprescriptionComponent;
  let fixture: ComponentFixture<ValidateotherprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateotherprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateotherprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
