import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDentalComponent } from './insurance-dental.component';

describe('InsuranceDentalComponent', () => {
  let component: InsuranceDentalComponent;
  let fixture: ComponentFixture<InsuranceDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
