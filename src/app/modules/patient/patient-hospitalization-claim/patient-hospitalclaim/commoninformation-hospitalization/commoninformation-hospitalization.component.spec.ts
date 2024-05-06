import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoninformationHospitalizationComponent } from './commoninformation-hospitalization.component';

describe('CommoninformationHospitalizationComponent', () => {
  let component: CommoninformationHospitalizationComponent;
  let fixture: ComponentFixture<CommoninformationHospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoninformationHospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoninformationHospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
