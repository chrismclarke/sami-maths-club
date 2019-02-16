import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTermsPage } from './app-terms.page';

describe('AppTermsPage', () => {
  let component: AppTermsPage;
  let fixture: ComponentFixture<AppTermsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTermsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
