import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManagedoctorComponent } from './hospital-managedoctor.component';

describe('HospitalManagedoctorComponent', () => {
  let component: HospitalManagedoctorComponent;
  let fixture: ComponentFixture<HospitalManagedoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalManagedoctorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalManagedoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
