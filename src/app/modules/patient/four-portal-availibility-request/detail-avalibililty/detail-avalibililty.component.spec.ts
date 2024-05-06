import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAvalibililtyComponent } from './detail-avalibililty.component';

describe('DetailAvalibililtyComponent', () => {
  let component: DetailAvalibililtyComponent;
  let fixture: ComponentFixture<DetailAvalibililtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAvalibililtyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAvalibililtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
