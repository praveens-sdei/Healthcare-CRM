import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewopticalComponent } from './viewoptical.component';

describe('ViewopticalComponent', () => {
  let component: ViewopticalComponent;
  let fixture: ComponentFixture<ViewopticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewopticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewopticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
