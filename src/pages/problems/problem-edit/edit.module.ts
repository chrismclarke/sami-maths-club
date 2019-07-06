import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

import { EditPage } from "./edit.page";
import { FileUploaderModule } from "src/components/file-uploader/file-uploader.module";
import { HTMLEditorModule } from "src/components/html-editor/html-editor.module";
import { FileDetailModule } from "src/components/file-detail/file-detail.module";

const routes: Routes = [
  {
    path: "",
    component: EditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FileUploaderModule,
    FileDetailModule,
    HTMLEditorModule
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
