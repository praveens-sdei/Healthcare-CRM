import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypePreauthComponent } from './servicetype-preauth.component';

describe('ServicetypePreauthComponent', () => {
  let component: ServicetypePreauthComponent;
  let fixture: ComponentFixture<ServicetypePreauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypePreauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypePreauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
