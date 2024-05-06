import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceEntercodeComponent } from './insurance-entercode.component';

describe('InsuranceEntercodeComponent', () => {
  let component: InsuranceEntercodeComponent;
  let fixture: ComponentFixture<InsuranceEntercodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceEntercodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceEntercodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
