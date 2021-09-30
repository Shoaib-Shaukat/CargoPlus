import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwaderComponent } from './forwader.component';

describe('ForwaderComponent', () => {
  let component: ForwaderComponent;
  let fixture: ComponentFixture<ForwaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
