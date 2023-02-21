import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';

@Component({
  selector: 'app-catalogo-registro-patronal',
  templateUrl: './catalogo_registro_patronal.component.html',
  styleUrls: ['./catalogo_registro_patronal.component.css']
})
export class CatalogoRegistroPatronalComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public registros_patronales : any;
  public tipo_modal = 1;
  public modal : any;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  public clase = 1;
  public estado = 31;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public estados : any;

  constructor(
    private modalService: NgbModal,
    private compartido_service: CompartidoService) { }

  ngOnInit(): void {
    this.mostrarRegistrosPatronales();
  }

  mostrarRegistrosPatronales(){
    this.registros_patronales = [];
  }

  mostrarEstados(){
    this.estados = [];
    this.compartido_service.obtenerCatalogo("gen_cat_estados")
    .subscribe( (object : any) => {
      if(object.length > 0){
        this.estados = object;
      }
    });
  }

  guardar(){
    this.tipo_modal =1;
    this.openModal();
  }

  editar(){
    this.tipo_modal = 2;
    this.openModal();
  }

  busqueda(value : any){

  }

  getRegistroPatronal(event : any){

  }
  
  openModal() {
    this.mostrarEstados();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
}
