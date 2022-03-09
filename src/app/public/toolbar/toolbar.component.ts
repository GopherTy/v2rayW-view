import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MsgService } from 'src/app/service/msg/msg.service';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';


@Component({
  selector: 'public-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  // properties
  hiddenIcon: boolean

  // inject dialog service
  constructor(
    private dialog: MatDialog,
    private toast: ToasterService,
    private router: Router,
    private msg: MsgService,
  ) { }

  ngOnInit(): void {
    this.hiddenIcon = false
    // this.msg.messageSource.subscribe((single) => {
    //   switch (single) {
    //     case 1:
    //       this.hiddenIcon = false
    //       break;
    //     case 2:
    //       this.hiddenIcon = true
    //       break;
    //     default:
    //       break;
    //   }
    // })
  }

}
