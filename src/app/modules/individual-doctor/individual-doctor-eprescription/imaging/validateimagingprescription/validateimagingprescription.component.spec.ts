import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateimagingprescriptionComponent } from './validateimagingprescription.component';

describe('ValidateimagingprescriptionComponent', () => {
  let component: ValidateimagingprescriptionComponent;
  let fixture: ComponentFixture<ValidateimagingprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateimagingprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateimagingprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
