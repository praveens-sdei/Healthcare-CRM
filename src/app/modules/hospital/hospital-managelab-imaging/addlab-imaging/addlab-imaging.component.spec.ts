import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlabImagingComponent } from './addlab-imaging.component';

describe('AddlabImagingComponent', () => {
  let component: AddlabImagingComponent;
  let fixture: ComponentFixture<AddlabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddlabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
