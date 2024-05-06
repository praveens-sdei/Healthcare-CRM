import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationgroupviewComponent } from './associationgroupview.component';

describe('AssociationgroupviewComponent', () => {
  let component: AssociationgroupviewComponent;
  let fixture: ComponentFixture<AssociationgroupviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationgroupviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationgroupviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
