import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireinComponent } from './hirein.component';

describe('HireinComponent', () => {
  let component: HireinComponent;
  let fixture: ComponentFixture<HireinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
