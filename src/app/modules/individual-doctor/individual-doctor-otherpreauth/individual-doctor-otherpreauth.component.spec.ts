import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualDoctorOtherpreauthComponent } from './individual-doctor-otherpreauth.component';

describe('IndividualDoctorOtherpreauthComponent', () => {
  let component: IndividualDoctorOtherpreauthComponent;
  let fixture: ComponentFixture<IndividualDoctorOtherpreauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualDoctorOtherpreauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualDoctorOtherpreauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
