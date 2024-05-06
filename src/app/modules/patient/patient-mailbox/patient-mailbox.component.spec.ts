import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientMailboxComponent } from './patient-mailbox.component';

describe('PatientMailboxComponent', () => {
  let component: PatientMailboxComponent;
  let fixture: ComponentFixture<PatientMailboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientMailboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMailboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
