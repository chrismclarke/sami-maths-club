import { Component } from "@angular/core";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ProblemComponentsModule } from "../problem.components.module";
/*************************************************************************************
 * Instead of a single component we also export a module so that we can display as
 * a page either in a modal or at problems/filter
 *************************************************************************************/
@Component({
  selector: "app-problems-filter-page",
  template: `
    <app-problems-filter></app-problems-filter>
  `
})
export class ProblemsFilterPage {}

const routes: Routes = [
  {
    path: "filter",
    component: ProblemsFilterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProblemComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProblemsFilterPage]
})
export class ProblemsFilterPageModule {}
