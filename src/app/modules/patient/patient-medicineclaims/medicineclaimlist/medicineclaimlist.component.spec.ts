import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineclaimlistComponent } from './medicineclaimlist.component';

describe('MedicineclaimlistComponent', () => {
  let component: MedicineclaimlistComponent;
  let fixture: ComponentFixture<MedicineclaimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineclaimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineclaimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
