import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalProfilemanagementComponent } from './hospital-profilemanagement.component';

describe('HospitalProfilemanagementComponent', () => {
  let component: HospitalProfilemanagementComponent;
  let fixture: ComponentFixture<HospitalProfilemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalProfilemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalProfilemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
