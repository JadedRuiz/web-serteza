import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { COLOR } from 'src/config/config';

@Component({
  selector: 'app-catalogo-conceptos-tope',
  templateUrl: './catalogo_tope_conceptos.component.html',
})
export class CatalogoTopeConceptosComponent implements OnInit {
  
  public color = COLOR;

  constructor() {}

  ngOnInit(): void {
  }

}
