import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Problem } from "src/models/problem.model";
import stringReplaceAsync from "string-replace-async";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { base64StringToBlob } from "blob-util";
import { StorageService, UserService } from "src/services";
import { ProblemService } from "src/services/core/problem.service";
import { IUploadedFileMeta } from "src/models/common.model";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit, OnDestroy {
  problem: Problem;
  slug: string;
  imageIndex: number;
  saveStatus: string;
  canEdit: boolean;
  showFileUploader: boolean;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private storage: StorageService,
    private router: Router,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get("slug");
    if (this.slug) {
      this.problem = await this.problemService.getProblemBySlug(this.slug);
    } else {
      this.problem = this.problemService.generateNewProblem(
        this.userService.user.value.values._key
      );
    }
    this.showFileUploader = this.problem.values.facilitatorVersion.pdf
      ? false
      : true;
    this._addSubscribers();
  }

  async save() {
    console.log("saving problem", this.problem);
    this.saveStatus = "uploading images";
    this.problem.values.studentVersion.content = await this.uploadHtmlImages(
      this.problem.values.studentVersion.content
    );
    try {
      await this.problemService.saveProblem(this.problem.values);
      this.router.navigate([`/p/${this.problem.values.slug}`]);
    } catch (error) {
      console.error("could not save problem");
      throw error;
    }
  }

  async deleteToggle() {
    this.saveStatus = "saving";
    this.problem.values._deleted = !this.problem.values._deleted;
    await this.problemService.saveProblem(this.problem.values);
    console.log("problem saved", this.problem);
    this.saveStatus = null;
  }

  updateSlug(title: string) {
    this.problem.setSlug(title);
  }

  async facilitatorNotesUploaded(meta: IUploadedFileMeta) {
    const oldPdf = this.problem.values.facilitatorVersion.pdf;
    // delete old notes
    if (oldPdf && oldPdf.name !== meta.name) {
      await this.storage.deleteUploadedFile(oldPdf.fullPath);
    }
    // populate db, after which reflect in this page
    const values = { ...this.problem.values };
    values.facilitatorVersion.pdf = meta;
    await this.problemService.saveProblem(values);
    this.problem.values = values;
    this.showFileUploader = false;
  }
  // simply remove local facilitator note property to show uploader
  // (old notes will be deleted on new upload)
  replaceFacilitatorNotes() {
    this.showFileUploader = true;
  }

  // by default all images are put inline in html as data object
  // we want to convert these objects to files, upload to firebase, store meta to images array and update img tag src
  async uploadHtmlImages(html: string) {
    this.imageIndex = 0;
    // use regex to extract code between <img ... > tag
    const imgTagRegex = /<img([\w\W]+?)[\/]?>/g;
    const newHtml = await stringReplaceAsync(
      html,
      imgTagRegex,
      (match: string) => this.uploadDataImage(match)
    );
    return newHtml;
  }

  // take a single <img> tag string, covert src data to file, upload to firebase and return download filemeta
  // NOTE - lots of the regex and matching could be avoided if interacting with image insert before conversion to data,
  // however that would also make more complicated to keep track of
  private async uploadDataImage(imgTag: string) {
    const match = imgTag.match(/data:.+?(?=")/g);
    if (match) {
      // as we can't pass an index to the match function keeping track of problem index manually
      // that way we can populate the images meta in the order they appear in the html
      const i = this.imageIndex;
      this.imageIndex++;
      const imgData = match[0];
      const blob = this.dataToBlob(imgData);
      const extension = blob.type.split("/")[1];
      const path = `uploads/${this.problem.values._key}/${
        this.imageIndex
      }.${extension}`;
      const upload = await this.storage.uploadFile(path, blob);
      // populate subset of meta as anything possibly undefined will throw error
      this.problem.values.studentVersion.images[i] = upload;
      // put download url in img tag instead of data
      imgTag = imgTag.replace(imgData, upload.downloadUrl);
    }
    return imgTag;
  }

  private dataToBlob(imgData: string) {
    const fileType = imgData.match(/data:image\/[^;]+/)[0].split(":")[1];
    const blob = base64StringToBlob(
      imgData.replace(/^data:image\/\w+;base64,/, ""),
      fileType
    );
    return blob;
  }

  // unsubscribe to user changes
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // subscribe to user object to check has sufficient permissions
  private _addSubscribers() {
    this.userService.user.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.canEdit = user && user.values && user.values.permissions.editor;
    });
  }
}
