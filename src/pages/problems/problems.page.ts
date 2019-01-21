import { Component, OnInit, OnDestroy } from "@angular/core";
import { Problem } from "src/models/problem.model";
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
  constructor(private problemService: ProblemService) {}

  ngOnInit() {
    this.problems$ = this.problemService.problems.subscribe(p => {
      this.problems = p;
    });
  }

  ngOnDestroy() {
    this.problems$.unsubscribe();
  }
}
