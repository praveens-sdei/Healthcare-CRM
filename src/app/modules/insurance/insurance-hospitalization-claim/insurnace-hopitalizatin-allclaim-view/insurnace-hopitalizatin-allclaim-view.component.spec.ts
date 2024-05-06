import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurnaceHopitalizatinAllclaimViewComponent } from './insurnace-hopitalizatin-allclaim-view.component';

describe('InsurnaceHopitalizatinAllclaimViewComponent', () => {
  let component: InsurnaceHopitalizatinAllclaimViewComponent;
  let fixture: ComponentFixture<InsurnaceHopitalizatinAllclaimViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurnaceHopitalizatinAllclaimViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurnaceHopitalizatinAllclaimViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
