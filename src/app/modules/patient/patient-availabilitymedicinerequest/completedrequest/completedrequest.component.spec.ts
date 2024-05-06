import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedrequestComponent } from './completedrequest.component';

describe('CompletedrequestComponent', () => {
  let component: CompletedrequestComponent;
  let fixture: ComponentFixture<CompletedrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
