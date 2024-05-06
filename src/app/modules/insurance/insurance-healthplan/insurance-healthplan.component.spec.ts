import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceHealthplanComponent } from './insurance-healthplan.component';

describe('InsuranceHealthplanComponent', () => {
  let component: InsuranceHealthplanComponent;
  let fixture: ComponentFixture<InsuranceHealthplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceHealthplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceHealthplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
