import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ULDRouteComponent } from './uldroute.component';

describe('ULDRouteComponent', () => {
  let component: ULDRouteComponent;
  let fixture: ComponentFixture<ULDRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ULDRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ULDRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
