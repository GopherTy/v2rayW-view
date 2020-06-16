import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { V2rayComponent } from './v2ray/v2ray.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'v2ray', component: V2rayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
