import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireOutComponent } from './hire-out.component';

describe('HireOutComponent', () => {
  let component: HireOutComponent;
  let fixture: ComponentFixture<HireOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
