import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureHospitalComponent } from './esignature-hospital.component';

describe('EsignatureHospitalComponent', () => {
  let component: EsignatureHospitalComponent;
  let fixture: ComponentFixture<EsignatureHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureHospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
