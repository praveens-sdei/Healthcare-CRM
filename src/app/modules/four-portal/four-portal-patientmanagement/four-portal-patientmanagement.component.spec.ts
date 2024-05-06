import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalPatientmanagementComponent } from './four-portal-patientmanagement.component';

describe('FourPortalPatientmanagementComponent', () => {
  let component: FourPortalPatientmanagementComponent;
  let fixture: ComponentFixture<FourPortalPatientmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalPatientmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalPatientmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
