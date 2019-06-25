import { Component, Input } from "@angular/core";
import { IProblem } from "src/models/problem.model";
import { SVG_IMAGES } from "src/mocks/images.mock";
import { DomSanitizer } from "@angular/platform-browser";

interface IProblemSantized extends IProblem {
  sanitized: boolean;
}

@Component({
  selector: "app-problem-card",
  templateUrl: "./problem-card.component.html",
  styleUrls: ["./problem-card.component.scss"]
})
export class ProblemCardComponent {
  _problem: IProblemSantized;
  @Input()
  set problem(problem: IProblemSantized) {
    this._problem = this.sanitizeProblem(problem);
  }
  constructor(private sanitizer: DomSanitizer) {}

  // on load need to convert svg data correctly
  sanitizeProblem(problem: IProblemSantized) {
    const sanitizeProblem = {
      ...problem,
      sanitized: true,
      coverSVG: this.convertSVGToImageData(problem.coverSVG as string)
    };
    return sanitizeProblem as IProblemSantized;
  }

  // svgs can't be embedded programatically (angular sanitize limitation)
  // so convert to html that embeds within an <img> tag and div innerhtml
  private convertSVGToImageData(svgTag?: string) {
    // set default placeholder if not provided
    if (!svgTag) {
      svgTag = SVG_IMAGES[0];
    }
    const encodedSVG = this._encodeSVG(svgTag);
    const Html = `<img src="data:image/svg+xml,${encodedSVG}"/>`;
    return this.sanitizer.bypassSecurityTrustHtml(Html);
  }

  // method taken from http://yoksel.github.io/url-encoder/
  // applies selective replacement of uri characters
  private _encodeSVG(data: string): string {
    const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;
    data = data.replace(/"/g, "'");
    data = data.replace(/>\s{1,}</g, "><");
    data = data.replace(/\s{2,}/g, " ");
    return data.replace(symbols, encodeURIComponent);
  }
}
