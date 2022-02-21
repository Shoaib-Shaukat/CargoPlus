import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSEModuleComponent } from './gsemodule.component';

describe('GSEModuleComponent', () => {
  let component: GSEModuleComponent;
  let fixture: ComponentFixture<GSEModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GSEModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GSEModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
