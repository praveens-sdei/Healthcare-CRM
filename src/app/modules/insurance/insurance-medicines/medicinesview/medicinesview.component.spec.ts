import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicinesviewComponent } from './medicinesview.component';

describe('MedicinesviewComponent', () => {
  let component: MedicinesviewComponent;
  let fixture: ComponentFixture<MedicinesviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicinesviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicinesviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
