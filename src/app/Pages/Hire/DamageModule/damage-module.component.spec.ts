import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageModuleComponent } from './damage-module.component';

describe('DamageModuleComponent', () => {
  let component: DamageModuleComponent;
  let fixture: ComponentFixture<DamageModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DamageModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
