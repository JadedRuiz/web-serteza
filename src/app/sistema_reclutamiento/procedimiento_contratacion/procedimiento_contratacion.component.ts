import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';

@Component({
  selector: 'app-procedimiento-contratacion',
  templateUrl: './procedimiento_contratacion.component.html',
  styleUrls: ['./procedimiento_contratacion.component.css']
})
export class ProcedimientoContratacionComponent implements OnInit {
  
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
