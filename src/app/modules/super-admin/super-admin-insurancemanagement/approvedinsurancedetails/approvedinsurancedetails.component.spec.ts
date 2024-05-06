import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedinsurancedetailsComponent } from './approvedinsurancedetails.component';

describe('ApprovedinsurancedetailsComponent', () => {
  let component: ApprovedinsurancedetailsComponent;
  let fixture: ComponentFixture<ApprovedinsurancedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedinsurancedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedinsurancedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
