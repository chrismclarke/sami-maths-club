import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProblemsPage } from "./problems.page";

describe("ProblemsPage", () => {
  let component: ProblemsPage;
  let fixture: ComponentFixture<ProblemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
