import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationgroupdetailComponent } from './associationgroupdetail.component';

describe('AssociationgroupdetailComponent', () => {
  let component: AssociationgroupdetailComponent;
  let fixture: ComponentFixture<AssociationgroupdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationgroupdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationgroupdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
