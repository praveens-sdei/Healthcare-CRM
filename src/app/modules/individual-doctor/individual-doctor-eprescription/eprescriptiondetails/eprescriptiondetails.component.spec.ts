import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptiondetailsComponent } from './eprescriptiondetails.component';

describe('EprescriptiondetailsComponent', () => {
  let component: EprescriptiondetailsComponent;
  let fixture: ComponentFixture<EprescriptiondetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptiondetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
