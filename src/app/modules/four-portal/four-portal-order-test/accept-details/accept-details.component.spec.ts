import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptDetailsComponent } from './accept-details.component';

describe('AcceptDetailsComponent', () => {
  let component: AcceptDetailsComponent;
  let fixture: ComponentFixture<AcceptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
