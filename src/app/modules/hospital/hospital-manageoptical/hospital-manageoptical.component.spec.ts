import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalManageopticalComponent } from './hospital-manageoptical.component';

describe('HospitalManageopticalComponent', () => {
  let component: HospitalManageopticalComponent;
  let fixture: ComponentFixture<HospitalManageopticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalManageopticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalManageopticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
