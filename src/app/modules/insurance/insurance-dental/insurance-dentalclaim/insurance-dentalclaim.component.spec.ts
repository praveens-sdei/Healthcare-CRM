import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDentalclaimComponent } from './insurance-dentalclaim.component';

describe('InsuranceDentalclaimComponent', () => {
  let component: InsuranceDentalclaimComponent;
  let fixture: ComponentFixture<InsuranceDentalclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceDentalclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDentalclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
