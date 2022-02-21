import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptModuleComponent } from './dept-module.component';

describe('DeptModuleComponent', () => {
  let component: DeptModuleComponent;
  let fixture: ComponentFixture<DeptModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
