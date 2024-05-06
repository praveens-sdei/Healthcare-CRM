import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaximumRequestComponent } from './maximum-request.component';

describe('MaximumRequestComponent', () => {
  let component: MaximumRequestComponent;
  let fixture: ComponentFixture<MaximumRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaximumRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaximumRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
