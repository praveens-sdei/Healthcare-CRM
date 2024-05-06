import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSetpasswordComponent } from './hospital-setpassword.component';

describe('HospitalSetpasswordComponent', () => {
  let component: HospitalSetpasswordComponent;
  let fixture: ComponentFixture<HospitalSetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalSetpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalSetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
