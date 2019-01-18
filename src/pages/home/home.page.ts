import { Component } from "@angular/core";
import { MOCK_PROBLEMS } from "src/mocks/problems.mock";
import { Problem } from "src/models/problems.model";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  problems: Problem[];
  constructor() {
    this.problems = MOCK_PROBLEMS(20);
    console.log("problems", this.problems);
  }
}
