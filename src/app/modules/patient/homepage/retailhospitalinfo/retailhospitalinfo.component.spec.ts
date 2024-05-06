import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailhospitalinfoComponent } from './retailhospitalinfo.component';

describe('RetailhospitalinfoComponent', () => {
  let component: RetailhospitalinfoComponent;
  let fixture: ComponentFixture<RetailhospitalinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailhospitalinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailhospitalinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
