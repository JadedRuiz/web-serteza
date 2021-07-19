import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-catalogo-concepto',
  templateUrl: './catalogo_concepto.component.html',
  styleUrls: ['./catalogo_concepto.component.css']
})
export class CatalogoConceptoComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public conceptos : any;

  constructor() { }

  ngOnInit(): void {
    this.mostrarConceptos();
  }

  mostrarConceptos(){
    this.conceptos = [];
  }

  guardar(){

  }

  busqueda(value : any){

  }

  getConcepto(event : any){

  }

}
