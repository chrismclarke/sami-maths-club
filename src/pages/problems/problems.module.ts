import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";

import { ProblemsPage } from "./problems.page";
import { ProblemComponentsModule } from "src/components/problem-components/problem.components.module";
import { GeneralComponentsModule } from "src/components/general-components/general.components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralComponentsModule,
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
