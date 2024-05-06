import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionvaccinationComponent } from './eprescriptionvaccination.component';

describe('EprescriptionvaccinationComponent', () => {
  let component: EprescriptionvaccinationComponent;
  let fixture: ComponentFixture<EprescriptionvaccinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionvaccinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionvaccinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
