import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignplanComponent } from './assignplan.component';

describe('AssignplanComponent', () => {
  let component: AssignplanComponent;
  let fixture: ComponentFixture<AssignplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignplanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
