import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEnterotpComponent } from './patient-enterotp.component';

describe('PatientEnterotpComponent', () => {
  let component: PatientEnterotpComponent;
  let fixture: ComponentFixture<PatientEnterotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientEnterotpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEnterotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
