import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManageparamedicalProfessionsComponent } from './hospital-manageparamedical-professions.component';

describe('HospitalManageparamedicalProfessionsComponent', () => {
  let component: HospitalManageparamedicalProfessionsComponent;
  let fixture: ComponentFixture<HospitalManageparamedicalProfessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalManageparamedicalProfessionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalManageparamedicalProfessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
