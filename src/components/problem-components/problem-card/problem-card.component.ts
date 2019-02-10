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

  private convertSVGToImageData(svgTag?: string) {
    // set default placeholder if not provided
    if (!svgTag) {
      svgTag = SVG_IMAGES[0];
    }
    return this.sanitizer.bypassSecurityTrustHtml(
      `<img src='data:image/svg+xml;utf8,
      ${svgTag}
      ' alt="" />`
    );
  }
}
