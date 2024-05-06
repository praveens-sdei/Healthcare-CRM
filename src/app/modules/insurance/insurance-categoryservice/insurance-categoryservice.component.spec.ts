import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCategoryserviceComponent } from './insurance-categoryservice.component';

describe('InsuranceCategoryserviceComponent', () => {
  let component: InsuranceCategoryserviceComponent;
  let fixture: ComponentFixture<InsuranceCategoryserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCategoryserviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCategoryserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
