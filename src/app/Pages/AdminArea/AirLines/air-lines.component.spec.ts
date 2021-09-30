import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirLinesComponent } from './air-lines.component';

describe('AirLinesComponent', () => {
  let component: AirLinesComponent;
  let fixture: ComponentFixture<AirLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirLinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
