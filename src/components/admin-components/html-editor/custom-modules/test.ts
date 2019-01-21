import Quill from "quill";
export class Test {
  quill: Quill;
  options: any;
  container: any;
  constructor(quill: Quill, options: any) {
    console.log("test constructor");
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector("#test");
    quill.on("text-change", () => this.textChanged());
  }

  textChanged() {
    const text = this.quill.getText();
    // There are a couple issues with counting words
    // this way but we'll fix these later
    // console.log("text changed", text);
  }
}
