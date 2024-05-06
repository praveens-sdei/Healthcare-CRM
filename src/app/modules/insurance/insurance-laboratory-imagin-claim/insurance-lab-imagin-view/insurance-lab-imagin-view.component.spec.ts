import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceLabImaginViewComponent } from './insurance-lab-imagin-view.component';

describe('InsuranceLabImaginViewComponent', () => {
  let component: InsuranceLabImaginViewComponent;
  let fixture: ComponentFixture<InsuranceLabImaginViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceLabImaginViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceLabImaginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
