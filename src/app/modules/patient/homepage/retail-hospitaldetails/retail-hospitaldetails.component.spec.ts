import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailHospitaldetailsComponent } from './retail-hospitaldetails.component';

describe('RetailHospitaldetailsComponent', () => {
  let component: RetailHospitaldetailsComponent;
  let fixture: ComponentFixture<RetailHospitaldetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailHospitaldetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailHospitaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
