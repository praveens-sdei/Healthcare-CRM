import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentallistComponent } from './dentallist.component';

describe('DentallistComponent', () => {
  let component: DentallistComponent;
  let fixture: ComponentFixture<DentallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DentallistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
