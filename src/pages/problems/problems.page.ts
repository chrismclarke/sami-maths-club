import { Component, OnInit, OnDestroy } from "@angular/core";
import { Problem } from "src/models/problem.model";
import { ProblemService } from "src/services/problem.service";
import { Subscription, Observable } from "rxjs";
import { User } from "src/models/user.model";
import { UserService } from "src/services/user.service";

@Component({
  selector: "app-problems",
  templateUrl: "problems.page.html",
  styleUrls: ["problems.page.scss"]
})
export class ProblemsPage implements OnInit, OnDestroy {
  problems$: Subscription;
  problems: Problem[];
  user$: Observable<User>;
  constructor(
    private problemService: ProblemService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.problems$ = this.problemService.problems.subscribe(p => {
      this.problems = p;
    });
    // subject needs to be subscribed to as observable if using with async pipe (handle auto unsubscripbe)
    this.user$ = this.userService.user.asObservable();
  }

  ngOnDestroy() {
    this.problems$.unsubscribe();
  }
}
