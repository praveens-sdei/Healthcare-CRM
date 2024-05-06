import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHealthcarenetworkComponent } from './insurance-healthcarenetwork.component';

describe('InsuranceHealthcarenetworkComponent', () => {
  let component: InsuranceHealthcarenetworkComponent;
  let fixture: ComponentFixture<InsuranceHealthcarenetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHealthcarenetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHealthcarenetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
