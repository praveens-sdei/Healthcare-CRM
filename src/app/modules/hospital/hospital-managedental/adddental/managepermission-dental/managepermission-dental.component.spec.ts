import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepermissionDentalComponent } from './managepermission-dental.component';

describe('ManagepermissionDentalComponent', () => {
  let component: ManagepermissionDentalComponent;
  let fixture: ComponentFixture<ManagepermissionDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagepermissionDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepermissionDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
