import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortaltypecategoryComponent } from './portaltypecategory.component';

describe('PortaltypecategoryComponent', () => {
  let component: PortaltypecategoryComponent;
  let fixture: ComponentFixture<PortaltypecategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortaltypecategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortaltypecategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
