import { Component, OnInit, OnDestroy } from "@angular/core";
import { IProblem } from "src/models/problem.model";
import { ProblemService } from "src/services/core/problem.service";
import { Subscription, Observable } from "rxjs";
import { User } from "src/models/user.model";
import { UserService } from "src/services/core/user.service";
import { ModalController } from "@ionic/angular";
import { ProblemsFilterPage } from "src/components/problem-components/problems-filter/problems-filter.module";

@Component({
  selector: "app-problems",
  templateUrl: "problems.page.html",
  styleUrls: ["problems.page.scss"]
})
export class ProblemsPage implements OnInit, OnDestroy {
  problems$: Subscription;
  problems: IProblem[];
  user$: Observable<User>;
  constructor(
    private problemService: ProblemService,
    private userService: UserService,
    private ModalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.problems$ = this.problemService.problems.subscribe(p => {
      this.problems = this.filterProblems(p);
    });
    // subject needs to be subscribed to as observable if using with async pipe (handle auto unsubscripbe)
    this.user$ = this.userService.user.asObservable();
  }

  filterProblems(problems: IProblem[]) {
    let p = [...problems];
    // remove deleted
    p = p.filter(v => !v.deleted);
    // hide temp from non-admin or non-creator

    // sort by created
    const sorted = p.sort((a, b) => {
      return a._created > b._created ? 1 : -1;
    });
    return sorted;
  }

  ngOnDestroy() {
    this.problems$.unsubscribe();
  }

  async showFilters() {
    const modal = await this.ModalCtrl.create({
      component: ProblemsFilterPage
    });
    await modal.present();
  }
}

const testComp = Component({
  selector: "app-test"
});
