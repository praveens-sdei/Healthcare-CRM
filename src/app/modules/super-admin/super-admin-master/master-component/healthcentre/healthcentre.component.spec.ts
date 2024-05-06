import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcentreComponent } from './healthcentre.component';

describe('HealthcentreComponent', () => {
  let component: HealthcentreComponent;
  let fixture: ComponentFixture<HealthcentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthcentreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthcentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
