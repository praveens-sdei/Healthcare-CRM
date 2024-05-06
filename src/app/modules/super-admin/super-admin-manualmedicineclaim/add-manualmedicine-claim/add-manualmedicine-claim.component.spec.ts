import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddManualmedicineClaimComponent } from './add-manualmedicine-claim.component';

describe('AddManualmedicineClaimComponent', () => {
  let component: AddManualmedicineClaimComponent;
  let fixture: ComponentFixture<AddManualmedicineClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddManualmedicineClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManualmedicineClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
