import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateeprescriptionsComponent } from './validateeprescriptions.component';

describe('ValidateeprescriptionsComponent', () => {
  let component: ValidateeprescriptionsComponent;
  let fixture: ComponentFixture<ValidateeprescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateeprescriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateeprescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
