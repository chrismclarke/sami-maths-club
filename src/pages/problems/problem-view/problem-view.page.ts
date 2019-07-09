import { Component, OnInit, OnDestroy } from "@angular/core";
import { Problem } from "src/models/problem.model";
import { ProblemService } from "src/services/core/problem.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { FadeIn } from "src/animations/animations";
import { UserService, StorageService } from "src/services";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "src/environments";
import { IUploadedFileMeta } from "src/models/common.model";
import { replaceContentUrls } from "src/hacks/hacks";

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
    private userService: UserService,
    private storageService: StorageService
  ) {}

  get facilitatorNotes() {
    return this.problem.values.facilitatorVersion.pdf;
  }

  ngOnInit() {
    this.loadProblem();
    this._addSubscribers();
  }

  // use route to get problem from slug
  async loadProblem() {
    const slug = this.route.snapshot.paramMap.get("slug");
    const problem = await this.problemService.getProblemBySlug(slug);
    if (problem.values) {
      const studentVersion = problem.values.studentVersion;
      const { content, images } = problem.values.studentVersion;
      studentVersion.content = await this.replaceImages(content, images);
      this.studentVersionContent = this.sanitizeContent(studentVersion.content);
      this.problem = problem;
    } else {
      // if no problem found navigate to main problems page
      this.back();
      throw new Error(`Problem not found: ${slug}`);
    }
  }

  openFacilitatorNotes() {
    return this.storageService.openFile(this.facilitatorNotes);
  }

  back() {
    this.router.navigate(["/problems"]);
  }

  // on android need to replace content image urls with local image
  async replaceImages(content: string, images: IUploadedFileMeta[]) {
    if (environment.isAndroid) {
      const localImages = await Promise.all(
        images.map(async imgMeta => {
          const uri = await this.storageService.getCachedFileURI(imgMeta);
          // capacitor projects can't display file urls but have custom capacitor-file:/// prefix
          return {
            ...imgMeta,
            _androidPath: uri
          };
        })
      );
      localImages.forEach(localMeta => {
        content = replaceContentUrls(content, localMeta);
      });
    }
    return content;
  }

  // angular sanitizer strips inline style, we want to prevent that
  sanitizeContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
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
