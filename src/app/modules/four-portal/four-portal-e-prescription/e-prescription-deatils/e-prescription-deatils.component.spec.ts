import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPrescriptionDeatilsComponent } from './e-prescription-deatils.component';

describe('EPrescriptionDeatilsComponent', () => {
  let component: EPrescriptionDeatilsComponent;
  let fixture: ComponentFixture<EPrescriptionDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPrescriptionDeatilsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPrescriptionDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
