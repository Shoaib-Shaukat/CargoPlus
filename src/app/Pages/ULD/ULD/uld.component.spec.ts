import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ULDComponent } from './uld.component';

describe('ULDComponent', () => {
  let component: ULDComponent;
  let fixture: ComponentFixture<ULDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ULDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ULDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
