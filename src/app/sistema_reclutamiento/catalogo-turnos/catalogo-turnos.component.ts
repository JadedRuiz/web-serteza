import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';


@Component({
  selector: 'app-catalogo-turnos',
  templateUrl: './catalogo-turnos.component.html',
  styleUrls: ['./catalogo-turnos.component.css']
})
export class CatalogoTurnosComponent implements OnInit {
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
