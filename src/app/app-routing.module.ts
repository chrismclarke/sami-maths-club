import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadChildren: "../pages/home/home.module#HomePageModule"
  },
  {
    path: "list",
    loadChildren: "../pages/list/list.module#ListPageModule"
  },
  {
    path: "p",
    loadChildren: "../pages/list/list.module#ListPageModule"
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
