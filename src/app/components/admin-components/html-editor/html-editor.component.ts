import { OnInit, ViewChild, Component } from "@angular/core";
import { QuillEditorComponent, QuillModules } from "ngx-quill";
import Quill from "quill";
// NOTE - most plugins don't have good support for ng so using custom code instead
import { Test } from "./custom-modules/test";
import { ImageDropAndPaste } from "./custom-modules/dropAndPaste";
Quill.register("modules/test", Test);
Quill.register("modules/imageDropAndPaste", ImageDropAndPaste);

/* This component implements ngx-quill with custom modules for image copy/paste and upload
   NOTE - stylesheets for quill are imported globally in global.scss
   Example implementations: 
   https://github.com/KillerCodeMonkey/ngx-quill-example/blob/master/src/app.component.ts
   https://github.com/KillerCodeMonkey/ngx-quill-ionic-v3/tree/master/src/app
*/

interface ICustomQuillModules extends QuillModules {
  [plugin: string]: any;
}

const quillModules: ICustomQuillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],
    ["link", "image", "video"] // link and image, video
  ],
  // syntax: false,
  // mention: {},
  // custom modules passes options defined
  test: {
    // custom options
    hello: "world"
  },
  imageDropAndPaste: {
    // add an custom image handler
  }
};

@Component({
  selector: "app-html-editor",
  templateUrl: "./html-editor.component.html",
  styleUrls: ["./html-editor.component.scss"]
})
export class HtmlEditorComponent implements OnInit {
  @ViewChild("editor") editor: QuillEditorComponent;
  modules = quillModules;
  text: string;
  constructor() {}

  ngOnInit() {
    console.log("quill editor loaded", this.editor);
  }
}
