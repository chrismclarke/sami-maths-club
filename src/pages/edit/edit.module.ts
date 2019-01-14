import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { QuillModule } from "ngx-quill";

import { IonicModule } from "@ionic/angular";

import { EditPage } from "./edit.page";

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
    QuillModule
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
