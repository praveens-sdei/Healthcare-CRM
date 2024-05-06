import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintlistComponent } from './complaintlist.component';

describe('ComplaintlistComponent', () => {
  let component: ComplaintlistComponent;
  let fixture: ComponentFixture<ComplaintlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
