import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitallistComponent } from './hospitallist.component';

describe('HospitallistComponent', () => {
  let component: HospitallistComponent;
  let fixture: ComponentFixture<HospitallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
