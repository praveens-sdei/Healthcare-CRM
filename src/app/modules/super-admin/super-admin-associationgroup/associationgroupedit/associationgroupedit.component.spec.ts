import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationgroupeditComponent } from './associationgroupedit.component';

describe('AssociationgroupeditComponent', () => {
  let component: AssociationgroupeditComponent;
  let fixture: ComponentFixture<AssociationgroupeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociationgroupeditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociationgroupeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
