import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftTypesComponent } from './aircraft-types.component';

describe('AircraftTypesComponent', () => {
  let component: AircraftTypesComponent;
  let fixture: ComponentFixture<AircraftTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AircraftTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AircraftTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
