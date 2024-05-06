import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsignatureComponent } from './esignature.component';

describe('EsignatureComponent', () => {
  let component: EsignatureComponent;
  let fixture: ComponentFixture<EsignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsignatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
