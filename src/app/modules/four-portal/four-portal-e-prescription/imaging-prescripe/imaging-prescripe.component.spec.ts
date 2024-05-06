import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagingPrescripeComponent } from './imaging-prescripe.component';

describe('ImagingPrescripeComponent', () => {
  let component: ImagingPrescripeComponent;
  let fixture: ComponentFixture<ImagingPrescripeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagingPrescripeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagingPrescripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
