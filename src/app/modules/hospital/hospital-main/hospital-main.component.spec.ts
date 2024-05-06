import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalMainComponent } from './hospital-main.component';

describe('HospitalMainComponent', () => {
  let component: HospitalMainComponent;
  let fixture: ComponentFixture<HospitalMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
