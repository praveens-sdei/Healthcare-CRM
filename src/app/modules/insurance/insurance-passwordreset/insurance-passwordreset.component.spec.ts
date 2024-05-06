import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancePasswordresetComponent } from './insurance-passwordreset.component';

describe('InsurancePasswordresetComponent', () => {
  let component: InsurancePasswordresetComponent;
  let fixture: ComponentFixture<InsurancePasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancePasswordresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancePasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
