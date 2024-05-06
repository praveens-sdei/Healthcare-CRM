import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalAllRequestListComponent } from './four-portal-all-request-list.component';

describe('FourPortalAllRequestListComponent', () => {
  let component: FourPortalAllRequestListComponent;
  let fixture: ComponentFixture<FourPortalAllRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalAllRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalAllRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
