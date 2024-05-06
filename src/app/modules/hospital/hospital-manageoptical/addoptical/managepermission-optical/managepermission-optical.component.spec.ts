import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepermissionOpticalComponent } from './managepermission-optical.component';

describe('ManagepermissionOpticalComponent', () => {
  let component: ManagepermissionOpticalComponent;
  let fixture: ComponentFixture<ManagepermissionOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepermissionOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepermissionOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
