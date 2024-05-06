import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicalProfessionPriceRequestComponent } from './paramedical-profession-price-request.component';

describe('ParamedicalProfessionPriceRequestComponent', () => {
  let component: ParamedicalProfessionPriceRequestComponent;
  let fixture: ComponentFixture<ParamedicalProfessionPriceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamedicalProfessionPriceRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamedicalProfessionPriceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
