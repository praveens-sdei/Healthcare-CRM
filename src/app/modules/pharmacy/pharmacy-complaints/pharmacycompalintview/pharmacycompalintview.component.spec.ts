import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacycompalintviewComponent } from './pharmacycompalintview.component';

describe('PharmacycompalintviewComponent', () => {
  let component: PharmacycompalintviewComponent;
  let fixture: ComponentFixture<PharmacycompalintviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacycompalintviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacycompalintviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
