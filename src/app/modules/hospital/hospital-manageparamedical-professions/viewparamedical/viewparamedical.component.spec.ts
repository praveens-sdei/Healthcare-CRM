import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewparamedicalComponent } from './viewparamedical.component';

describe('ViewparamedicalComponent', () => {
  let component: ViewparamedicalComponent;
  let fixture: ComponentFixture<ViewparamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewparamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewparamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
