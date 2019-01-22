import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsFilterComponent } from './problems-filter.component';

describe('ProblemsFilterComponent', () => {
  let component: ProblemsFilterComponent;
  let fixture: ComponentFixture<ProblemsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
