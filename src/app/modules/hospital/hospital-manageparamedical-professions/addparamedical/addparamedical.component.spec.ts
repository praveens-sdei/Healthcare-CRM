import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddparamedicalComponent } from './addparamedical.component';

describe('AddparamedicalComponent', () => {
  let component: AddparamedicalComponent;
  let fixture: ComponentFixture<AddparamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddparamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddparamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
