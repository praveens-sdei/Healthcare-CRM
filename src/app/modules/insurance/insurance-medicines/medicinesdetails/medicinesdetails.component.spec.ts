import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesdetailsComponent } from './medicinesdetails.component';

describe('MedicinesdetailsComponent', () => {
  let component: MedicinesdetailsComponent;
  let fixture: ComponentFixture<MedicinesdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicinesdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
