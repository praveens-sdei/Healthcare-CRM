import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareNetworkComponent } from './healthcare-network.component';

describe('HealthcareNetworkComponent', () => {
  let component: HealthcareNetworkComponent;
  let fixture: ComponentFixture<HealthcareNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthcareNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthcareNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
