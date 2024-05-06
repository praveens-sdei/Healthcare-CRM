import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalizationEsignatureComponent } from './hospitalization-esignature.component';

describe('HospitalizationEsignatureComponent', () => {
  let component: HospitalizationEsignatureComponent;
  let fixture: ComponentFixture<HospitalizationEsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalizationEsignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizationEsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
