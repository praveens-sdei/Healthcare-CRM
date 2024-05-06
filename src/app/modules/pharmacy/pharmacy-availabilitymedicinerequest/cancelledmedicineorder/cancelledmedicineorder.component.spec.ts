import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledmedicineorderComponent } from './cancelledmedicineorder.component';

describe('CancelledmedicineorderComponent', () => {
  let component: CancelledmedicineorderComponent;
  let fixture: ComponentFixture<CancelledmedicineorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelledmedicineorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledmedicineorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
