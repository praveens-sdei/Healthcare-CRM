import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptioneyeglassesComponent } from './eprescriptioneyeglasses.component';

describe('EprescriptioneyeglassesComponent', () => {
  let component: EprescriptioneyeglassesComponent;
  let fixture: ComponentFixture<EprescriptioneyeglassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptioneyeglassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptioneyeglassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
