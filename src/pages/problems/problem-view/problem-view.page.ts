import { Component, OnInit, OnDestroy } from "@angular/core";
import { Problem } from "src/models/problem.model";
import { ProblemService } from "src/services/core/problem.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FadeIn } from "src/animations/animations";
import { UserService } from "src/services/core/user.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-problem-view",
  templateUrl: "./problem-view.page.html",
  styleUrls: ["./problem-view.page.scss"],
  animations: [FadeIn]
})
export class ProblemViewPage implements OnInit, OnDestroy {
  problem: Problem;
  studentVersionContent: SafeHtml;
  renderReady: boolean;
  canEdit: boolean;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadProblem();
    this._addSubscribers();
  }

  // use route to get problem from slug
  async loadProblem() {
    const slug = this.route.snapshot.paramMap.get("slug");
    const problem = await this.problemService.getProblemBySlug(slug);
    if (problem.values) {
      this.sanitizeProblem(problem);
      this.problem = problem;
      console.log("problem", this.problem.values);
    } else {
      // if no problem found navigate to main problems page
      this.back();
      throw new Error(`Problem not found: ${slug}`);
    }
  }

  back() {
    this.router.navigate(["/problems"]);
  }

  // angular sanitizer strips inline style, we want to prevent that
  sanitizeProblem(problem: Problem) {
    this.studentVersionContent = this.sanitizer.bypassSecurityTrustHtml(
      problem.values.studentVersion.content
    );
  }

  // remove subscriptions
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // subscribe to user object to check has sufficient permissions
  private _addSubscribers() {
    this.userService.user.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.canEdit =
        user && user.values && user.values.permissions.editor ? true : false;
    });
  }
}
