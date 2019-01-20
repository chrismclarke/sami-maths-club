import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClubPage } from './my-club.page';

describe('MyClubPage', () => {
  let component: MyClubPage;
  let fixture: ComponentFixture<MyClubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyClubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
