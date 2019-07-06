import { Component, Input } from "@angular/core";

@Component({
  selector: "app-file-icon",
  template: `
    <img [src]="imgSrc" style="width:48px; height:48px" />
  `
})
export class AppFileIconComponent {
  extension: string;
  imgSrc: string;

  @Input() set filename(filename: string) {
    console.log("filename set", filename);
    const extension = filename.split(".").pop();
    this.imgSrc = this.getIconPath(extension);
    console.log("imgSrc", this.imgSrc);
  }

  getIconPath(extension: string) {
    // tslint:disable no-use-before-declare
    const i = ASSET_ICONS;
    const iconFilename = i.hasOwnProperty(extension) ? i[extension] : i.default;
    return `assets/svgs/filetypes/${iconFilename}`;
  }
}

const ASSET_ICONS = {
  default: "file.svg",
  pdf: "pdf.svg",
  jpg: "img.svg",
  png: "img.svg"
};
