import { Component } from "@angular/core";
import { MOCK_PROBLEMS } from "src/mocks/problems.mock";
import { Problem } from "src/models/problems.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-problems",
  templateUrl: "problems.page.html",
  styleUrls: ["problems.page.scss"]
})
export class ProblemsPage {
  problems: Problem[];
  constructor(private sanitizer: DomSanitizer) {
    this.problems = MOCK_PROBLEMS(20).map(p => {
      p.coverImg = this.convertSVGToImageData(p.coverImg) as SafeHtml;
      return p;
    });
    console.log("problems", this.problems);
  }

  // NOTE - this could be moved to separate problem-card component
  private convertSVGToImageData(svgTag: string) {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<img src='data:image/svg+xml;utf8,
      ${svgTag}
      ' alt="" />`
    );
  }
}
