import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthPlanviewComponent } from './health-planview.component';

describe('HealthPlanviewComponent', () => {
  let component: HealthPlanviewComponent;
  let fixture: ComponentFixture<HealthPlanviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthPlanviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthPlanviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
