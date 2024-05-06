import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalprofileComponent } from './dentalprofile.component';

describe('DentalprofileComponent', () => {
  let component: DentalprofileComponent;
  let fixture: ComponentFixture<DentalprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentalprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
