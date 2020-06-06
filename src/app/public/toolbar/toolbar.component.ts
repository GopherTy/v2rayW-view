import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'public-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  // properties
  hiddenIcon: boolean

  // inject dialog service
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.hiddenIcon = true
  }

  // open LoginComponent
  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent)

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    })
  }
}
