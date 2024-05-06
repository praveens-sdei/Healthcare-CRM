import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingdetailsComponent } from './pendingdetails.component';

describe('PendingdetailsComponent', () => {
  let component: PendingdetailsComponent;
  let fixture: ComponentFixture<PendingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
