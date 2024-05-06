import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccinationPrescripeComponent } from './vaccination-prescripe.component';

describe('VaccinationPrescripeComponent', () => {
  let component: VaccinationPrescripeComponent;
  let fixture: ComponentFixture<VaccinationPrescripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaccinationPrescripeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinationPrescripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
