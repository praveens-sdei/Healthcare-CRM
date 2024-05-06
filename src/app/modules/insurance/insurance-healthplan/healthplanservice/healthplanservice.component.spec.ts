import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthplanserviceComponent } from './healthplanservice.component';

describe('HealthplanserviceComponent', () => {
  let component: HealthplanserviceComponent;
  let fixture: ComponentFixture<HealthplanserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthplanserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthplanserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
