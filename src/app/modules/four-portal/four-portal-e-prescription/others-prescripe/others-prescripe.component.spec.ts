import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersPrescripeComponent } from './others-prescripe.component';

describe('OthersPrescripeComponent', () => {
  let component: OthersPrescripeComponent;
  let fixture: ComponentFixture<OthersPrescripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersPrescripeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersPrescripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
