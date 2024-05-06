import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineclaimdetailsComponent } from './medicineclaimdetails.component';

describe('MedicineclaimdetailsComponent', () => {
  let component: MedicineclaimdetailsComponent;
  let fixture: ComponentFixture<MedicineclaimdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineclaimdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineclaimdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
