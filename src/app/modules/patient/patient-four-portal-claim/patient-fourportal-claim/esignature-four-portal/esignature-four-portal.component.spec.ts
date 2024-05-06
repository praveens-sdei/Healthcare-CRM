import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureFourPortalComponent } from './esignature-four-portal.component';

describe('EsignatureFourPortalComponent', () => {
  let component: EsignatureFourPortalComponent;
  let fixture: ComponentFixture<EsignatureFourPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureFourPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureFourPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
