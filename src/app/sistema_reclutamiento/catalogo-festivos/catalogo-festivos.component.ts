import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';


@Component({
  selector: 'app-catalogo-festivos',
  templateUrl: './catalogo-festivos.component.html',
  styleUrls: ['./catalogo-festivos.component.css']
})
export class CatalogoFestivosComponent implements OnInit {
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
