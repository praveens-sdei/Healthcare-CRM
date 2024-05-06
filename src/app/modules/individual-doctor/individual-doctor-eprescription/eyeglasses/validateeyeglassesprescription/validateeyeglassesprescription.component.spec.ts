import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateeyeglassesprescriptionComponent } from './validateeyeglassesprescription.component';

describe('ValidateeyeglassesprescriptionComponent', () => {
  let component: ValidateeyeglassesprescriptionComponent;
  let fixture: ComponentFixture<ValidateeyeglassesprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateeyeglassesprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateeyeglassesprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
