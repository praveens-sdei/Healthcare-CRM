import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationHospitalComponent } from './commoninformation-hospital.component';

describe('CommoninformationHospitalComponent', () => {
  let component: CommoninformationHospitalComponent;
  let fixture: ComponentFixture<CommoninformationHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
