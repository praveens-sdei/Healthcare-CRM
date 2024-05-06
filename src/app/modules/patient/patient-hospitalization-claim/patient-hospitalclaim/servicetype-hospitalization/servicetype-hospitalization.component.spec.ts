import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeHospitalizationComponent } from './servicetype-hospitalization.component';

describe('ServicetypeHospitalizationComponent', () => {
  let component: ServicetypeHospitalizationComponent;
  let fixture: ComponentFixture<ServicetypeHospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeHospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeHospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
