import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompalintlistComponent } from './compalintlist.component';

describe('CompalintlistComponent', () => {
  let component: CompalintlistComponent;
  let fixture: ComponentFixture<CompalintlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompalintlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompalintlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
