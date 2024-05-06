import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedmedicineorderComponent } from './rejectedmedicineorder.component';

describe('RejectedmedicineorderComponent', () => {
  let component: RejectedmedicineorderComponent;
  let fixture: ComponentFixture<RejectedmedicineorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectedmedicineorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectedmedicineorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
