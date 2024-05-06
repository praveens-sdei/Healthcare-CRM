import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintdetailsComponent } from './complaintdetails.component';

describe('ComplaintdetailsComponent', () => {
  let component: ComplaintdetailsComponent;
  let fixture: ComponentFixture<ComplaintdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
