import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorSubscriptionplanComponent } from './individual-doctor-subscriptionplan.component';

describe('IndividualDoctorSubscriptionplanComponent', () => {
  let component: IndividualDoctorSubscriptionplanComponent;
  let fixture: ComponentFixture<IndividualDoctorSubscriptionplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorSubscriptionplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorSubscriptionplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
