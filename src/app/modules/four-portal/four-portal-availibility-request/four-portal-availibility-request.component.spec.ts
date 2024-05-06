import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalAvailibilityRequestComponent } from './four-portal-availibility-request.component';

describe('FourPortalAvailibilityRequestComponent', () => {
  let component: FourPortalAvailibilityRequestComponent;
  let fixture: ComponentFixture<FourPortalAvailibilityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalAvailibilityRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalAvailibilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
