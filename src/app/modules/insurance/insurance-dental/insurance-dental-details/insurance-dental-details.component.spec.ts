import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDentalDetailsComponent } from './insurance-dental-details.component';

describe('InsuranceDentalDetailsComponent', () => {
  let component: InsuranceDentalDetailsComponent;
  let fixture: ComponentFixture<InsuranceDentalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDentalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDentalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
