import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';

@Component({
  selector: 'app-catalogo-cuenta-bancaria',
  templateUrl: './catalogo_cuenta_bancaria.component.html',
  styleUrls: ['./catalogo_cuenta_bancaria.component.css']
})
export class CatalogoCuentaBancariaComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public cuentas_bancarias : any;
  public modal : any;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public tipo_modal = 1;
  public bancos : any;
  public banco = 0;

  constructor(
    private modalService: NgbModal,
    private compartido_service: CompartidoService) { }

  ngOnInit(): void {
    this.mostrarCuentasBancarias();
  }

  mostrarCuentasBancarias(){
    this.cuentas_bancarias = [];
  }

  mostrarCatalogoBancos(){
    this.bancos = [];
    this.compartido_service.obtenerCatalogo("sat_catbancos")
    .subscribe( (object : any) =>{
      if(object.length > 0){
        this.bancos = object;
      }
    });
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

  getCuentaBancaria(event : any){

  }

  openModal() {
    this.mostrarCatalogoBancos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

}
