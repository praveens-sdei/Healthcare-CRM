import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLabImagindetailsComponent } from './insurance-lab-imagindetails.component';

describe('InsuranceLabImagindetailsComponent', () => {
  let component: InsuranceLabImagindetailsComponent;
  let fixture: ComponentFixture<InsuranceLabImagindetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLabImagindetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLabImagindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
