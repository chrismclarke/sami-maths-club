import Quill from "quill";

export class ImageDropAndPaste {
  quill: Quill;
  options: any;
  constructor(quill: Quill, options: any = {}) {
    this.quill = quill;
    this.options = options;
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener("drop", this.handleDrop, false);
    this.quill.root.addEventListener("paste", this.handlePaste, false);
  }

  /* handle image drop event
   */
  handleDrop(e) {
    console.log("drop handle");
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset
          );
        }
      }
      this.readFiles(e.dataTransfer.files, (dataUrl, type) => {
        if (typeof this.options.handler === "function") {
          this.options.handler(dataUrl, type);
        } else {
          this.insert.call(this, dataUrl, type);
        }
      });
    }
  }

  /* handle image paste event
   */
  handlePaste(e: ClipboardEvent) {
    e.preventDefault();

    const types = e.clipboardData.types;
    const items: DataTransferItemList = e.clipboardData.items;

    console.log("items", items);
    types.forEach(type => {
      console.log(type, e.clipboardData.getData(type));
    });
    for (let i = 0; i < items.length; i++) {
      console.log("item", items[i]);
    }
    // if (
    //   e.clipboardData &&
    //   e.clipboardData.items &&
    //   e.clipboardData.items.length
    // ) {
    //   this.readFiles(e.clipboardData.items, (dataUrl, type) => {
    //     const selection = this.quill.getSelection();
    //     if (selection) {
    //     } else {
    //       setTimeout(() => {
    //         if (typeof this.options.handler === "function") {
    //           this.options.handler(dataUrl, type);
    //         } else {
    //           this.insert(dataUrl, type);
    //         }
    //       }, 0);
    //     }
    //   });
    // }
  }

  /* read the files
   */
  readFiles(files, callback) {
    [].forEach.call(files, file => {
      console.log("reading file", file);
      const type = file.type;
      if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        console.log("e", e);
        // callback(e.target.result, type);
      };
      const blob = file.getAsFile ? file.getAsFile() : file;
      if (blob instanceof Blob) {
        reader.readAsDataURL(blob);
      }
    });
  }

  /* insert into the editor
   */
  insert(dataUrl, type) {
    const index = this.quill.getSelection().index;
    // (this.quill.getSelection() || {}).index || this.quill.getLength();
    this.quill.insertEmbed(index, "image", dataUrl, "user");
  }
}
