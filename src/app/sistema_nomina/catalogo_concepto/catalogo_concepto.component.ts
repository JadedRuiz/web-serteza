import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;

  constructor(
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.mostrarConceptos();
  }

  mostrarConceptos(){
    this.conceptos = [];
  }

  guardar(){
    this.openModal();
  }

  busqueda(value : any){

  }

  getConcepto(event : any){

  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

}
