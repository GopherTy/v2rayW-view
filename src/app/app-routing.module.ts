import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { V2rayComponent } from './v2ray/v2ray.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'index', component: V2rayComponent },
  { path: '', redirectTo: "/index", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
