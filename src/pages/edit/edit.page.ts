import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProblemService } from "src/services/problem.service";
import { IProblem } from "src/models/problems.model";
import stringReplaceAsync from "string-replace-async";
import { base64StringToBlob } from "blob-util";
import { DbService } from "src/services/db.service";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  isLoading = true;
  problem: IProblem;
  slug: string;
  imageIndex: number;
  saveStatus: string;

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private db: DbService
  ) {}

  async ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get("slug");
    if (this.slug) {
      this.problem = await this.problemService.getProblemBySlug(this.slug);
    } else {
      this.problem = this.problemService.generateNewProblem();
    }
    this.isLoading = false;
  }

  async save() {
    this.saveStatus = "uploading images";
    this.problem.studentVersion.content = await this.uploadHtmlImages(
      this.problem.studentVersion.content
    );
    await this.db.afs
      .doc(`problems/${this.problem._key}`)
      .set(this.problem.values())
      .catch(err => {
        this.saveStatus = "error";
      });
    this.saveStatus = "saved";
    setTimeout(() => {
      this.saveStatus = null;
    }, 2000);
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
      const path = `uploads/${this.problem._key}/${
        this.imageIndex
      }.${extension}`;
      const upload = await this.db.uploadFile(path, blob);
      // populate subset of meta as anything possibly undefined will throw error
      this.problem.studentVersion.images[i] = upload;
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
}
