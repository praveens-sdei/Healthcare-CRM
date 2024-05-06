import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalProfilecreatComponent } from './hospital-profilecreat.component';

describe('HospitalProfilecreatComponent', () => {
  let component: HospitalProfilecreatComponent;
  let fixture: ComponentFixture<HospitalProfilecreatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalProfilecreatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalProfilecreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
