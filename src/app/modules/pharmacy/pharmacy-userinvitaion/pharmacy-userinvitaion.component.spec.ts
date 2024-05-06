import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyUserinvitaionComponent } from './pharmacy-userinvitaion.component';

describe('PharmacyUserinvitaionComponent', () => {
  let component: PharmacyUserinvitaionComponent;
  let fixture: ComponentFixture<PharmacyUserinvitaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyUserinvitaionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyUserinvitaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
