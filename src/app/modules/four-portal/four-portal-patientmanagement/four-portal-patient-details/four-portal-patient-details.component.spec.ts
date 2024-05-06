import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalPatientDetailsComponent } from './four-portal-patient-details.component';

describe('FourPortalPatientDetailsComponent', () => {
  let component: FourPortalPatientDetailsComponent;
  let fixture: ComponentFixture<FourPortalPatientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalPatientDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
