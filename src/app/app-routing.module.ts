import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "problems",
    pathMatch: "full"
  },
  // {
  //   path: "home",
  //   loadChildren: "../pages/home/home.module#HomePageModule"
  // },
  {
    path: "problems",
    loadChildren: "../pages/problems/problems.module#ProblemsPageModule"
  },
  {
    path: "p",
    redirectTo: "problems",
    pathMatch: "full"
  },
  {
    path: "p/:slug",
    loadChildren:
      "../pages/problems/problem-view/problem-view.module#ProblemViewPageModule"
  },
  {
    path: "p/:slug/edit",
    loadChildren: "../pages/problems/problem-edit/edit.module#EditPageModule"
  },
  {
    path: "new-problem",
    loadChildren: "../pages/problems/problem-edit/edit.module#EditPageModule"
  },
  {
    path: "my-club",
    loadChildren: "../pages/my-club/my-club.module#MyClubPageModule"
  },
  { path: "login", loadChildren: "../pages/login/login.module#LoginPageModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
