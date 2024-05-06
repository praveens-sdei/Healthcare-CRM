import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribersviewComponent } from './subscribersview.component';

describe('SubscribersviewComponent', () => {
  let component: SubscribersviewComponent;
  let fixture: ComponentFixture<SubscribersviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscribersviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribersviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
