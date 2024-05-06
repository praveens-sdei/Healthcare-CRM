import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyCreatprofileComponent } from './pharmacy-creatprofile.component';

describe('PharmacyCreatprofileComponent', () => {
  let component: PharmacyCreatprofileComponent;
  let fixture: ComponentFixture<PharmacyCreatprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyCreatprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyCreatprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
