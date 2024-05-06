import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorPasswordresetComponent } from './individual-doctor-passwordreset.component';

describe('IndividualDoctorPasswordresetComponent', () => {
  let component: IndividualDoctorPasswordresetComponent;
  let fixture: ComponentFixture<IndividualDoctorPasswordresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorPasswordresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorPasswordresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
