import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryOfExclusionComponent } from './category-of-exclusion.component';

describe('CategoryOfExclusionComponent', () => {
  let component: CategoryOfExclusionComponent;
  let fixture: ComponentFixture<CategoryOfExclusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryOfExclusionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryOfExclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
