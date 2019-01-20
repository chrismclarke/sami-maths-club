import { Component } from "@angular/core";
import { MOCK_PROBLEMS } from "src/mocks/problems.mock";
import { Problem } from "src/models/problems.model";

@Component({
  selector: "app-problem",
  templateUrl: "problems.page.html",
  styleUrls: ["problems.page.scss"]
})
export class ProblemsPage {
  problems: Problem[];
  constructor() {
    this.problems = MOCK_PROBLEMS(20);
    console.log("problems", this.problems);
  }
}
