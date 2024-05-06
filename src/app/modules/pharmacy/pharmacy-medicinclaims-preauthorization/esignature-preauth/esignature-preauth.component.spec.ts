import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignaturePreauthComponent } from './esignature-preauth.component';

describe('EsignaturePreauthComponent', () => {
  let component: EsignaturePreauthComponent;
  let fixture: ComponentFixture<EsignaturePreauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignaturePreauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignaturePreauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
