import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalOrderTestComponent } from './four-portal-order-test.component';

describe('FourPortalOrderTestComponent', () => {
  let component: FourPortalOrderTestComponent;
  let fixture: ComponentFixture<FourPortalOrderTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalOrderTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalOrderTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
