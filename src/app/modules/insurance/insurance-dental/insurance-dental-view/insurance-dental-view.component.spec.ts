import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDentalViewComponent } from './insurance-dental-view.component';

describe('InsuranceDentalViewComponent', () => {
  let component: InsuranceDentalViewComponent;
  let fixture: ComponentFixture<InsuranceDentalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDentalViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDentalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
