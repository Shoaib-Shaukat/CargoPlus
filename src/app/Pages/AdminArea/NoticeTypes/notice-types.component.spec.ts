import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeTypesComponent } from './notice-types.component';

describe('NoticeTypesComponent', () => {
  let component: NoticeTypesComponent;
  let fixture: ComponentFixture<NoticeTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
