import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlabImagingComponent } from './viewlab-imaging.component';

describe('ViewlabImagingComponent', () => {
  let component: ViewlabImagingComponent;
  let fixture: ComponentFixture<ViewlabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewlabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
