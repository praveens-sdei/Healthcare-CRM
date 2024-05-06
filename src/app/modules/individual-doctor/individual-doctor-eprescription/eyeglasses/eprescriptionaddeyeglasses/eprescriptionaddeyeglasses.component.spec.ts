import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionaddeyeglassesComponent } from './eprescriptionaddeyeglasses.component';

describe('EprescriptionaddeyeglassesComponent', () => {
  let component: EprescriptionaddeyeglassesComponent;
  let fixture: ComponentFixture<EprescriptionaddeyeglassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionaddeyeglassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionaddeyeglassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
