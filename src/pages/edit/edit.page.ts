import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProblemService } from "src/services/problem.service";
import { IProblem } from "src/models/problems.model";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  isLoading = true;
  problem: IProblem;
  slug: string;
  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService
  ) {}

  async ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get("slug");
    if (this.slug) {
      this.problem = await this.problemService.getProblemBySlug(this.slug);
      console.log("problem", this.problem);
    } else {
      this.problem = this.problemService.generateNewProblem();
    }
    this.isLoading = false;
  }
}
