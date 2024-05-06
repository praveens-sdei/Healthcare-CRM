import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatelabprescriptionComponent } from './validatelabprescription.component';

describe('ValidatelabprescriptionComponent', () => {
  let component: ValidatelabprescriptionComponent;
  let fixture: ComponentFixture<ValidatelabprescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatelabprescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatelabprescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
