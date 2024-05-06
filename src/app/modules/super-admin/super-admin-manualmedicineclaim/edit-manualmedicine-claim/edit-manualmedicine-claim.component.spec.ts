import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManualmedicineClaimComponent } from './edit-manualmedicine-claim.component';

describe('EditManualmedicineClaimComponent', () => {
  let component: EditManualmedicineClaimComponent;
  let fixture: ComponentFixture<EditManualmedicineClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditManualmedicineClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManualmedicineClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
