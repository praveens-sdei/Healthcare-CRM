import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepermissionLabImagingComponent } from './managepermission-lab-imaging.component';

describe('ManagepermissionLabImagingComponent', () => {
  let component: ManagepermissionLabImagingComponent;
  let fixture: ComponentFixture<ManagepermissionLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepermissionLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepermissionLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
