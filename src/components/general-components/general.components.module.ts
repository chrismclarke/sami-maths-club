import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProfileButtonComponent } from "./profile-button/profile-button.component";
import { SWCheckComponent } from "./sw-check";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ProfileButtonComponent, SWCheckComponent],
  exports: [ProfileButtonComponent, SWCheckComponent]
})
export class GeneralComponentsModule {}
