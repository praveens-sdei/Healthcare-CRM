import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceMedicinesComponent } from './insurance-medicines.component';

describe('InsuranceMedicinesComponent', () => {
  let component: InsuranceMedicinesComponent;
  let fixture: ComponentFixture<InsuranceMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceMedicinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
