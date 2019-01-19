import {
  OnInit,
  ViewChild,
  Component,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { QuillEditorComponent, QuillModules } from "ngx-quill";
import Quill from "quill";
// NOTE - most plugins don't have good support for ng so using custom forks
import { ImageDropAndPaste } from "quill-image-drop-and-paste";
Quill.register("modules/imageDropAndPaste", ImageDropAndPaste);
import ImageResize from "quill-image-resize-module-mended";
Quill.register("modules/imageResize", ImageResize);

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
    ["bold", "italic", "underline"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }],
    [{ header: [false, 2, 3, 4] }],
    [{ color: [] }],
    ["image"]
  ],
  // syntax: false,
  // mention: {},
  // custom modules passes options defined

  imageDropAndPaste: {
    // add an custom image handler
  },
  imageResize: true
};

@Component({
  selector: "app-html-editor",
  templateUrl: "./html-editor.component.html",
  styleUrls: ["./html-editor.component.scss"]
})
export class HtmlEditorComponent implements OnInit {
  @ViewChild("editor") editor: QuillEditorComponent;
  modules = quillModules;
  quillVal: string;
  // set/get html to pass quill html value between parent-child
  // https://blog.angulartraining.com/tutorial-create-your-own-two-way-data-binding-in-angular-46487650ea82
  @Input()
  get html() {
    return this.quillVal;
  }
  set html(val: string) {
    this.quillVal = val;
    this.htmlChange.emit(this.quillVal);
  }
  @Output()
  htmlChange = new EventEmitter();
  constructor() {}

  // want extra ngmodel emitter when quill value changes to notify parent component
  onQuillChange(val: string) {
    this.htmlChange.emit(val);
  }

  ngOnInit() {
    console.log("quill editor loaded", this.editor);
  }
}
