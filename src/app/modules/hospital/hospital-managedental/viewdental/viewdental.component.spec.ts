import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdentalComponent } from './viewdental.component';

describe('ViewdentalComponent', () => {
  let component: ViewdentalComponent;
  let fixture: ComponentFixture<ViewdentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewdentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
