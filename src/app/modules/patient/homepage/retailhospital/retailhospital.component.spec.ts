import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailhospitalComponent } from './retailhospital.component';

describe('RetailhospitalComponent', () => {
  let component: RetailhospitalComponent;
  let fixture: ComponentFixture<RetailhospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailhospitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailhospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
