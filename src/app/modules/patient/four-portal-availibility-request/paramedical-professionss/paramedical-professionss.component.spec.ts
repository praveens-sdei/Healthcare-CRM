import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicalProfessionssComponent } from './paramedical-professionss.component';

describe('ParamedicalProfessionssComponent', () => {
  let component: ParamedicalProfessionssComponent;
  let fixture: ComponentFixture<ParamedicalProfessionssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParamedicalProfessionssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamedicalProfessionssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
