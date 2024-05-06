import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAllListComponent } from './price-all-list.component';

describe('PriceAllListComponent', () => {
  let component: PriceAllListComponent;
  let fixture: ComponentFixture<PriceAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceAllListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
