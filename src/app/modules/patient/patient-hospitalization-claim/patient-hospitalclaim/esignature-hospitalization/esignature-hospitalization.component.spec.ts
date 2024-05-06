import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureHospitalizationComponent } from './esignature-hospitalization.component';

describe('EsignatureHospitalizationComponent', () => {
  let component: EsignatureHospitalizationComponent;
  let fixture: ComponentFixture<EsignatureHospitalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureHospitalizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureHospitalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
