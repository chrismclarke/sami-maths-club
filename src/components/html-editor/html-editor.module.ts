import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QuillModule } from "ngx-quill";
import { IonicModule } from "@ionic/angular";
import { HtmlEditorComponent } from "./html-editor.component";

/* These components are imported on various logged in pages to perform administration tasks such
   as adding new problems
*/
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, QuillModule],
  declarations: [HtmlEditorComponent],
  exports: [HtmlEditorComponent]
})
export class HTMLEditorModule {}
