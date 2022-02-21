import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireInSearchComponent } from './hire-in-search.component';

describe('HireInSearchComponent', () => {
  let component: HireInSearchComponent;
  let fixture: ComponentFixture<HireInSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HireInSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HireInSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
