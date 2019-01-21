import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemViewPage } from './problem-view.page';

describe('ProblemViewPage', () => {
  let component: ProblemViewPage;
  let fixture: ComponentFixture<ProblemViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
