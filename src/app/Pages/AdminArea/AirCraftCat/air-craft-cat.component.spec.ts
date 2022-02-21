import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirCraftCatComponent } from './air-craft-cat.component';

describe('AirCraftCatComponent', () => {
  let component: AirCraftCatComponent;
  let fixture: ComponentFixture<AirCraftCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirCraftCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirCraftCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
