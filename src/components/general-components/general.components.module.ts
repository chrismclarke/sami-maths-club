import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProfileButtonComponent } from "./profile-button/profile-button.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [ProfileButtonComponent],
  exports: [ProfileButtonComponent]
})
export class GeneralComponentsModule {}
