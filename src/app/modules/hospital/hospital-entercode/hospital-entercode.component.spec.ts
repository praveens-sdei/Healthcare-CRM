import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEntercodeComponent } from './hospital-entercode.component';

describe('HospitalEntercodeComponent', () => {
  let component: HospitalEntercodeComponent;
  let fixture: ComponentFixture<HospitalEntercodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalEntercodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalEntercodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
