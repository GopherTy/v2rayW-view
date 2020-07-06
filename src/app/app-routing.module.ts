import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { V2rayComponent } from './v2ray/v2ray.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'v2ray', component: V2rayComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
