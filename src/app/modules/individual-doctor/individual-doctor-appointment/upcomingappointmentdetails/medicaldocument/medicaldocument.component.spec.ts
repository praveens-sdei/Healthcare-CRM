import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaldocumentComponent } from './medicaldocument.component';

describe('MedicaldocumentComponent', () => {
  let component: MedicaldocumentComponent;
  let fixture: ComponentFixture<MedicaldocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicaldocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicaldocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
