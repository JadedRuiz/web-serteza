import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import Swal from 'sweetalert2';

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
    id_empresa : this.empresa,
    id_sucursal : "",
    id_cliente : "",
    sucursal : "",
    tasa_estatal : 0.00,
    tasa_especial : 0.00,
    zona : "",
    region : "",
    estado : 0,
    prima_riesgo : 0.00,
    usuario : this.usuario
  };
  public sucursales_bus : any;
  public tipo_modal = 1;

  constructor(
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService,
    private sucursal_service : SucursalService
    ) { }

  ngOnInit(): void {
    this.mostrarSucursales();
  }

  mostrarSucursales(){
    this.sucursales = [];
    this.sucursal_service.obtenerSucursales(this.empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.sucursales = object.data;
      }
    });
  }

  guardar(){
    this.tipo_modal = 1;
    this.openModal();
  }

  busqueda(value : any){
    if(value.length > 2){
      this.sucursales_bus = [];
      let json = {
        nombre_tabla : "nom_sucursales",
        nombre_columna : "sucursal",
        busqueda : value,
        select : ["id_sucursal","sucursal"],
        filtros : []
      };
      this.compartido_service.obtenerCatalogoAutoComplete(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.sucursales_bus = object.data;
        }
      })
    }
  }

  getSucursal(event : any){
    this.editar(event.option.id);
    this.myControl.reset('');
    this.sucursales_bus = [];
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
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta esta sucursal?","info",null,1);
  }

  editar(id : any){
    this.sucursal_service.obtenerSucursalPorIdSucursal(id)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.openModal();
        this.tipo_modal = 2;
        let sucursal = object.data[0];
        this.json.id_sucursal = id;
        this.json.id_cliente = sucursal.id_cliente;
        this.json.sucursal = sucursal.sucursal;
        this.json.zona = sucursal.zona;
        this.json.region = sucursal.region;
        this.json.tasa_estatal = sucursal.tasaimpuestoestatal;
        this.json.tasa_especial = sucursal.tasaimpuestoespecial;
        this.json.prima_riesgo = sucursal.prima_riesgotrabajo;
        this.json.estado = sucursal.id_estado;
      }else{
        Swal.fire("Ha ocurrido un error","No se ha encontrado la sucursal","error");
      }
    });
  }

  modificarSucursal(){
    this.confirmar("Confirmación","¿Seguro que deseas modificar esta sucursal?","info",null,2);
  }

  openModal() {
    this.mostrarEstados();
    this.mostrarClientes();
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  limpiarCampos(){
    this.json = {
      id_empresa : this.empresa,
      id_sucursal : "",
      id_cliente : "",
      sucursal : "",
      tasa_estatal : 0.00,
      tasa_especial : 0.00,
      zona : "",
      region : "",
      estado : 0,
      prima_riesgo : 0.00,
      usuario : this.usuario
    };
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,json : any,tipo : number){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1){  //Guardar
          this.sucursal_service.crearSucursal(this.json)
          .subscribe( (object : any) => {
            if(object.ok){
              this.mostrarSucursales();
              this.cerrarModal();
              Swal.fire("Buen trabajo","Se ha agregado la sucursal con éxito","success");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.sucursal_service.modificarSucursal(this.json)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarSucursales();
              this.cerrarModal();
              Swal.fire("Buen trabajo","Se ha modificado la sucursal con éxito","success");
            }
          });
        }
      }
    });
  }
}
