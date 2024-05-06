import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSubscribersComponent } from './insurance-subscribers.component';

describe('InsuranceSubscribersComponent', () => {
  let component: InsuranceSubscribersComponent;
  let fixture: ComponentFixture<InsuranceSubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSubscribersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
