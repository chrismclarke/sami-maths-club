import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";

import { ProblemsPage } from "./problems.page";
import { ProblemComponentsModule } from "src/app/components/problem-components/problem.components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemComponentsModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProblemsPage
      }
    ])
  ],
  declarations: [ProblemsPage]
})
export class ProblemsPageModule {}
