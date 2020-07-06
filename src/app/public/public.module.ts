import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginComponent } from './login/login.component';
import { JoinComponent } from './join/join.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    ToolbarComponent,
    LoginComponent,
    JoinComponent,
    PageNotFoundComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  exports: [
    ToolbarComponent,
    LoginComponent,
  ],
  entryComponents: [
    LoginComponent,
  ],
})
export class PublicModule { }
