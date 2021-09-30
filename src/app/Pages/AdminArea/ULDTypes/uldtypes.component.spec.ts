import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ULDTypesComponent } from './uldtypes.component';

describe('ULDTypesComponent', () => {
  let component: ULDTypesComponent;
  let fixture: ComponentFixture<ULDTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ULDTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ULDTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
