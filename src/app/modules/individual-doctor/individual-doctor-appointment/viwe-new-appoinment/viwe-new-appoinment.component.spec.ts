import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViweNewAppoinmentComponent } from './viwe-new-appoinment.component';

describe('ViweNewAppoinmentComponent', () => {
  let component: ViweNewAppoinmentComponent;
  let fixture: ComponentFixture<ViweNewAppoinmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViweNewAppoinmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViweNewAppoinmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
