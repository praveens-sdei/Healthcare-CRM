import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMasterComponent } from './hospital-master.component';

describe('HospitalMasterComponent', () => {
  let component: HospitalMasterComponent;
  let fixture: ComponentFixture<HospitalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
