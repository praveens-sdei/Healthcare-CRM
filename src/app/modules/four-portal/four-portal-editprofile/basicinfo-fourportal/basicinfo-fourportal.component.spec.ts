import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoFourportalComponent } from './basicinfo-fourportal.component';

describe('BasicinfoFourportalComponent', () => {
  let component: BasicinfoFourportalComponent;
  let fixture: ComponentFixture<BasicinfoFourportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicinfoFourportalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoFourportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
