import { Component, OnInit } from "@angular/core";
import { IProblem } from "src/models/problem.model";
import { ProblemService } from "src/services/problem.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FadeIn } from "src/animations/animations";

@Component({
  selector: "app-problem-view",
  templateUrl: "./problem-view.page.html",
  styleUrls: ["./problem-view.page.scss"],
  animations: [FadeIn]
})
export class ProblemViewPage implements OnInit {
  problem: IProblem;
  studentVersionContent: SafeHtml;
  renderReady: boolean;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProblem();
  }

  // use route to get problem from slug
  async loadProblem() {
    const slug = this.route.snapshot.paramMap.get("slug");
    this.problem = await this.problemService.getProblemBySlug(slug);
    this.sanitizeProblem(this.problem);
  }

  back() {
    this.router.navigate(["/problems"]);
  }

  // angular sanitizer strips inline style, we want to prevent that
  sanitizeProblem(problem: IProblem) {
    this.studentVersionContent = this.sanitizer.bypassSecurityTrustHtml(
      problem.studentVersion.content
    );
  }
}
