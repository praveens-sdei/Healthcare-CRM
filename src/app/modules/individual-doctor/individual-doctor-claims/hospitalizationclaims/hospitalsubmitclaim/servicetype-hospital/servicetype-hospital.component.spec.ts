import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeHospitalComponent } from './servicetype-hospital.component';

describe('ServicetypeHospitalComponent', () => {
  let component: ServicetypeHospitalComponent;
  let fixture: ComponentFixture<ServicetypeHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
