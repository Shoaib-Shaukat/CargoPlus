import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContourTypeComponent } from './contour-type.component';

describe('ContourTypeComponent', () => {
  let component: ContourTypeComponent;
  let fixture: ComponentFixture<ContourTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContourTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContourTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
