import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalCommunicationComponent } from './hospital-communication.component';

describe('HospitalCommunicationComponent', () => {
  let component: HospitalCommunicationComponent;
  let fixture: ComponentFixture<HospitalCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
