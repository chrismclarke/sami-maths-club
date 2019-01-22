import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";

import { ProblemsPage } from "./problems.page";
import { ProblemComponentsModule } from "src/components/problem-components/problem.components.module";
import { GeneralComponentsModule } from "src/components/general-components/general.components.module";
import { ProblemsFilterPageModule } from "src/components/problem-components/problems-filter/problems-filter.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralComponentsModule,
    ProblemComponentsModule,
    ProblemsFilterPageModule,
    RouterModule.forChild([
      {
        path: "",
        component: ProblemsPage
      }
    ])
  ],
  declarations: [ProblemsPage],
  entryComponents: []
})
export class ProblemsPageModule {}
