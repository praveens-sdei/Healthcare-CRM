import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLogsComponent } from './insurance-logs.component';

describe('InsuranceLogsComponent', () => {
  let component: InsuranceLogsComponent;
  let fixture: ComponentFixture<InsuranceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
