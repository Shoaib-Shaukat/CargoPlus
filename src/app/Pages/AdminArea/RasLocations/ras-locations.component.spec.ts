import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasLocationsComponent } from './ras-locations.component';

describe('RasLocationsComponent', () => {
  let component: RasLocationsComponent;
  let fixture: ComponentFixture<RasLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RasLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RasLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
