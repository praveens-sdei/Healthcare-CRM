import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceNewpasswordComponent } from './insurance-newpassword.component';

describe('InsuranceNewpasswordComponent', () => {
  let component: InsuranceNewpasswordComponent;
  let fixture: ComponentFixture<InsuranceNewpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceNewpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceNewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
