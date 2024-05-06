import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicinfoLabImagingComponent } from './basicinfo-lab-imaging.component';

describe('BasicinfoLabImagingComponent', () => {
  let component: BasicinfoLabImagingComponent;
  let fixture: ComponentFixture<BasicinfoLabImagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicinfoLabImagingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicinfoLabImagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
