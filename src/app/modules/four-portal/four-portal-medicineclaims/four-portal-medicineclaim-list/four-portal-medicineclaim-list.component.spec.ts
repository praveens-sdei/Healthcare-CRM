import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalMedicineclaimListComponent } from './four-portal-medicineclaim-list.component';

describe('FourPortalMedicineclaimListComponent', () => {
  let component: FourPortalMedicineclaimListComponent;
  let fixture: ComponentFixture<FourPortalMedicineclaimListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalMedicineclaimListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalMedicineclaimListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
