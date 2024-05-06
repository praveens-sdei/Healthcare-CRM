import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalMedicalproductstestsComponent } from './four-portal-medicalproductstests.component';

describe('FourPortalMedicalproductstestsComponent', () => {
  let component: FourPortalMedicalproductstestsComponent;
  let fixture: ComponentFixture<FourPortalMedicalproductstestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalMedicalproductstestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalMedicalproductstestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
