import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRolepermissionComponent } from './patient-rolepermission.component';

describe('PatientRolepermissionComponent', () => {
  let component: PatientRolepermissionComponent;
  let fixture: ComponentFixture<PatientRolepermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientRolepermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRolepermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
