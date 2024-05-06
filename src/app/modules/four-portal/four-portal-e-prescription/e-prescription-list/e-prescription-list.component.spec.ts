import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionListComponent } from './e-prescription-list.component';

describe('EPrescriptionListComponent', () => {
  let component: EPrescriptionListComponent;
  let fixture: ComponentFixture<EPrescriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPrescriptionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
