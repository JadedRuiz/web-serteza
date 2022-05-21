import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movimiento-bancos',
  templateUrl: './movimiento-bancos.component.html',
  styleUrls: ['./movimiento-bancos.component.css']
})
export class MovimientoBancosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  limpiar(){
    return true;
  }
}
