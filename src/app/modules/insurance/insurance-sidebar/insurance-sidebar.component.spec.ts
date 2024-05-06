import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSidebarComponent } from './insurance-sidebar.component';

describe('InsuranceSidebarComponent', () => {
  let component: InsuranceSidebarComponent;
  let fixture: ComponentFixture<InsuranceSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
