import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCreateprofileComponent } from './patient-createprofile.component';

describe('PatientCreateprofileComponent', () => {
  let component: PatientCreateprofileComponent;
  let fixture: ComponentFixture<PatientCreateprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCreateprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCreateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
