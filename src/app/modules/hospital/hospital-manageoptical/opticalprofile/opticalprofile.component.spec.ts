import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpticalprofileComponent } from './opticalprofile.component';

describe('OpticalprofileComponent', () => {
  let component: OpticalprofileComponent;
  let fixture: ComponentFixture<OpticalprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpticalprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpticalprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
