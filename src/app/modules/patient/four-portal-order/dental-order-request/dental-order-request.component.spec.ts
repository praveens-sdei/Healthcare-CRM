import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalOrderRequestComponent } from './dental-order-request.component';

describe('DentalOrderRequestComponent', () => {
  let component: DentalOrderRequestComponent;
  let fixture: ComponentFixture<DentalOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalOrderRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
