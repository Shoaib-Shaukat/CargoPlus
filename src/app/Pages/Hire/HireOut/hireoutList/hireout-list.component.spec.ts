import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireoutListComponent } from './hireout-list.component';

describe('HireoutListComponent', () => {
  let component: HireoutListComponent;
  let fixture: ComponentFixture<HireoutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireoutListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
