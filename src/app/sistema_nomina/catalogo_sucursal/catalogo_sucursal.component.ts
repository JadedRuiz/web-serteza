import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';

@Component({
  selector: 'app-catalogo-sucursal',
  templateUrl: './catalogo_sucursal.component.html',
  styleUrls: ['./catalogo_sucursal.component.css']
})
export class CatalogoSucursalComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  public sucursales : any;
  public estados : any;
  public clientes : any;
  public modal : any;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public json = {
    id_sucursal : "",
    id_cliente : "",
    sucursal : "",
    tasa_estatal : "",
    tasa_especial : "",
    zona : "",
    estado : 0,
    prima_riesgo : "",
    usuario : this.usuario
  };

  constructor(
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService
    ) { }

  ngOnInit(): void {
    this.mostrarSucursales();
  }

  mostrarSucursales(){
    this.sucursales = [];
  }

  guardar(){
    this.openModal();
  }

  busqueda(value : any){

  }

  getSucursal(event : any){

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

  mostrarClientes(){
    this.clientes = [];
    this.cliente_service.obtenerClientesPorIdEmpresa(this.empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.clientes = object.data;
      }
    });
  }

  altaSucursal(){
    console.log(this.json);
  }

  openModal() {
    this.mostrarEstados();
    this.mostrarClientes();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
}
