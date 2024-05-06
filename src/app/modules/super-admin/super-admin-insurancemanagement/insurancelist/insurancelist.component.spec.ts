import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancelistComponent } from './insurancelist.component';

describe('InsurancelistComponent', () => {
  let component: InsurancelistComponent;
  let fixture: ComponentFixture<InsurancelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurancelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
