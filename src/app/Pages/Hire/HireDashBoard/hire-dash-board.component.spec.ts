import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireDashBoardComponent } from './hire-dash-board.component';

describe('HireDashBoardComponent', () => {
  let component: HireDashBoardComponent;
  let fixture: ComponentFixture<HireDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireDashBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
