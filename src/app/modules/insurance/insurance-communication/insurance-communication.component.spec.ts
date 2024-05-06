import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCommunicationComponent } from './insurance-communication.component';

describe('InsuranceCommunicationComponent', () => {
  let component: InsuranceCommunicationComponent;
  let fixture: ComponentFixture<InsuranceCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
