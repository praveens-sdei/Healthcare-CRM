import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCategoryofexclusionComponent } from './insurance-categoryofexclusion.component';

describe('InsuranceCategoryofexclusionComponent', () => {
  let component: InsuranceCategoryofexclusionComponent;
  let fixture: ComponentFixture<InsuranceCategoryofexclusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCategoryofexclusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCategoryofexclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
