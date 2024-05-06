import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssociationGroupComponent } from './edit-association-group.component';

describe('EditAssociationGroupComponent', () => {
  let component: EditAssociationGroupComponent;
  let fixture: ComponentFixture<EditAssociationGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssociationGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssociationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
