import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProblemCardComponent } from "./problem-card/problem-card.component";

/* These components are imported on various logged in pages to perform administration tasks such
   as adding new problems
*/
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ProblemCardComponent],
  exports: [ProblemCardComponent]
})
export class ProblemComponentsModule {}
