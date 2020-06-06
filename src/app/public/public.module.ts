import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';


import { ToolbarComponent } from './toolbar/toolbar.component';



@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,


    MatIconModule,
    MatButtonModule,
    MatToolbarModule,

  ],
  exports: [
    ToolbarComponent,
  ]
})
export class PublicModule { }
