import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EprescriptionaddimagingComponent } from './eprescriptionaddimaging.component';

describe('EprescriptionaddimagingComponent', () => {
  let component: EprescriptionaddimagingComponent;
  let fixture: ComponentFixture<EprescriptionaddimagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EprescriptionaddimagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EprescriptionaddimagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
