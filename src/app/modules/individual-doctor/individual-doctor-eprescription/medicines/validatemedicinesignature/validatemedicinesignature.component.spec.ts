import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatemedicinesignatureComponent } from './validatemedicinesignature.component';

describe('ValidatemedicinesignatureComponent', () => {
  let component: ValidatemedicinesignatureComponent;
  let fixture: ComponentFixture<ValidatemedicinesignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatemedicinesignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatemedicinesignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
