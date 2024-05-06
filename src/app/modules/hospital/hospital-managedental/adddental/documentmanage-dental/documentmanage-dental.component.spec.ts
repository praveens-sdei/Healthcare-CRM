import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentmanageDentalComponent } from './documentmanage-dental.component';

describe('DocumentmanageDentalComponent', () => {
  let component: DocumentmanageDentalComponent;
  let fixture: ComponentFixture<DocumentmanageDentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentmanageDentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentmanageDentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
