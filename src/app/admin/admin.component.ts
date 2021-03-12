import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';

@Component({
  selector: 'app-rh',
  templateUrl: './admin.component.html',
  styles: []
})
export class AdminComponent implements OnInit {
  public color = COLOR;
  constructor() { }

  ngOnInit() {
  }

}
