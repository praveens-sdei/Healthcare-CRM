import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoOpticalComponent } from './basicinfo-optical.component';

describe('BasicinfoOpticalComponent', () => {
  let component: BasicinfoOpticalComponent;
  let fixture: ComponentFixture<BasicinfoOpticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicinfoOpticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoOpticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
