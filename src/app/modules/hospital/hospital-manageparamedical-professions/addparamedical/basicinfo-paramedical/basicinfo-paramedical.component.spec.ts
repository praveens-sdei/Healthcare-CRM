import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoParamedicalComponent } from './basicinfo-paramedical.component';

describe('BasicinfoParamedicalComponent', () => {
  let component: BasicinfoParamedicalComponent;
  let fixture: ComponentFixture<BasicinfoParamedicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicinfoParamedicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoParamedicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
