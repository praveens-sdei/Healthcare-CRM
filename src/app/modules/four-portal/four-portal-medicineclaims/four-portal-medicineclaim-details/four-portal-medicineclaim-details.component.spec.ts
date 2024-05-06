import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalMedicineclaimDetailsComponent } from './four-portal-medicineclaim-details.component';

describe('FourPortalMedicineclaimDetailsComponent', () => {
  let component: FourPortalMedicineclaimDetailsComponent;
  let fixture: ComponentFixture<FourPortalMedicineclaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalMedicineclaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalMedicineclaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
