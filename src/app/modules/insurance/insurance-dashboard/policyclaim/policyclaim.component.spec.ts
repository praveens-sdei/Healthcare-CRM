import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyclaimComponent } from './policyclaim.component';

describe('PolicyclaimComponent', () => {
  let component: PolicyclaimComponent;
  let fixture: ComponentFixture<PolicyclaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyclaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyclaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
