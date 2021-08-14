import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-catalogo-periodo',
  templateUrl: './catalogo_periodo.component.html',
  styleUrls: ['./catalogo_periodo.component.css']
})
export class CatalogoPeriodoComponent implements OnInit {

  public taken = 5;
  public anio = 1;
  public tipo_modal = 1;
  public tipo_nomina= 1;
  myControl = new FormControl();
  public periodos : any;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;

  constructor(
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.mostrarPeriodos();
  }

  mostrarPeriodos(){
    this.periodos = [];
  }

  guardar(){
    this.tipo_modal = 1;
    this.openModal();
  }

  editar(){
    this.tipo_modal = 2;
    this.openModal();
  }

  busqueda(value : any){

  }

  getPeriodo(event : any){

  }

  cambioDeAño(event : any){
   
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

}
