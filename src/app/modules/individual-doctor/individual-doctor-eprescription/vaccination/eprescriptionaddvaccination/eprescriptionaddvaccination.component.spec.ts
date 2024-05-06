import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionaddvaccinationComponent } from './eprescriptionaddvaccination.component';

describe('EprescriptionaddvaccinationComponent', () => {
  let component: EprescriptionaddvaccinationComponent;
  let fixture: ComponentFixture<EprescriptionaddvaccinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionaddvaccinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionaddvaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
