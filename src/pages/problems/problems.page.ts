import { Component, OnInit, OnDestroy } from "@angular/core";
import { Problem } from "src/models/problems.model";
import { DomSanitizer } from "@angular/platform-browser";
import { ProblemService } from "src/services/problem.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-problems",
  templateUrl: "problems.page.html",
  styleUrls: ["problems.page.scss"]
})
export class ProblemsPage implements OnInit, OnDestroy {
  problems$: Subscription;
  problems: Problem[];
  constructor(
    private sanitizer: DomSanitizer,
    private problemService: ProblemService
  ) {}

  ngOnInit() {
    this.problems$ = this.problemService.problems.subscribe(p => {
      this.problems = p;
    });
  }

  ngOnDestroy() {
    this.problems$.unsubscribe();
  }

  updateProblems() {}

  // NOTE - this could be moved to separate problem-card component
  private convertSVGToImageData(svgTag: string) {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<img src='data:image/svg+xml;utf8,
      ${svgTag}
      ' alt="" />`
    );
  }
}
