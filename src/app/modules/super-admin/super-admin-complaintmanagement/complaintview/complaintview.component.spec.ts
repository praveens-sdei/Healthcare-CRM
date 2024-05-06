import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintviewComponent } from './complaintview.component';

describe('ComplaintviewComponent', () => {
  let component: ComplaintviewComponent;
  let fixture: ComponentFixture<ComplaintviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
