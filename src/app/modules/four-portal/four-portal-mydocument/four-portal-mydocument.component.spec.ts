import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPortalMydocumentComponent } from './four-portal-mydocument.component';

describe('FourPortalMydocumentComponent', () => {
  let component: FourPortalMydocumentComponent;
  let fixture: ComponentFixture<FourPortalMydocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourPortalMydocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPortalMydocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
