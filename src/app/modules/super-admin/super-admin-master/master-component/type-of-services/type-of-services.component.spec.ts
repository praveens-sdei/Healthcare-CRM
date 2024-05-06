import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfServicesComponent } from './type-of-services.component';

describe('TypeOfServicesComponent', () => {
  let component: TypeOfServicesComponent;
  let fixture: ComponentFixture<TypeOfServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
