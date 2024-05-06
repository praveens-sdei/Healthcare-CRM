import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPrescripeComponent } from './lab-prescripe.component';

describe('LabPrescripeComponent', () => {
  let component: LabPrescripeComponent;
  let fixture: ComponentFixture<LabPrescripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPrescripeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabPrescripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
