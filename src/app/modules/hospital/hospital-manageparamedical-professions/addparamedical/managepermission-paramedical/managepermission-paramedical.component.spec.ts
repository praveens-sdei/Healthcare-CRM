import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepermissionParamedicalComponent } from './managepermission-paramedical.component';

describe('ManagepermissionParamedicalComponent', () => {
  let component: ManagepermissionParamedicalComponent;
  let fixture: ComponentFixture<ManagepermissionParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepermissionParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepermissionParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
