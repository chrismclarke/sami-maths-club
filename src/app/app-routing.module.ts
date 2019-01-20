import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "problems",
    pathMatch: "full"
  },
  {
    path: "problems",
    loadChildren: "../pages/problems/problems.module#ProblemsPageModule"
  },
  {
    path: "home",
    loadChildren: "../pages/home/home.module#HomePageModule"
  },
  {
    path: "p",
    loadChildren: "../pages/problems/problems.module#ProblemsPageModule"
  },
  {
    path: "p/:slug",
    loadChildren:
      "../pages/problem-view/problem-view.module#ProblemViewPageModule"
  },
  {
    path: "p/:slug/edit",
    loadChildren: "../pages/edit/edit.module#EditPageModule"
  },
  {
    path: "new-problem",
    loadChildren: "../pages/edit/edit.module#EditPageModule"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
