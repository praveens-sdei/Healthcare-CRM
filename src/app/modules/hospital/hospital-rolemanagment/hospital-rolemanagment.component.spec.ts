import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalRolemanagmentComponent } from './hospital-rolemanagment.component';

describe('HospitalRolemanagmentComponent', () => {
  let component: HospitalRolemanagmentComponent;
  let fixture: ComponentFixture<HospitalRolemanagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalRolemanagmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRolemanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
