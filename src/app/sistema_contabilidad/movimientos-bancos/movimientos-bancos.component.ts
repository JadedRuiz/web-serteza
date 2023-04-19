import { COLOR } from './../../../config/config';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimientos-bancos',
  templateUrl: './movimientos-bancos.component.html',
  styleUrls: ['./movimientos-bancos.component.css']
})
export class MovimientosBancosComponent implements OnInit {
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
