import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSharedComponent } from './address-shared.component';

describe('AddressSharedComponent', () => {
  let component: AddressSharedComponent;
  let fixture: ComponentFixture<AddressSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressSharedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
