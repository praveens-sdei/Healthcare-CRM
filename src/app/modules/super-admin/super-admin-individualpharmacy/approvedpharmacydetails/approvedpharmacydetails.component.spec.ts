import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedpharmacydetailsComponent } from './approvedpharmacydetails.component';

describe('ApprovedpharmacydetailsComponent', () => {
  let component: ApprovedpharmacydetailsComponent;
  let fixture: ComponentFixture<ApprovedpharmacydetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedpharmacydetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedpharmacydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
