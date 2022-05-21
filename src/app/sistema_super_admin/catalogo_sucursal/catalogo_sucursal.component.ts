import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/models/Direccion';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-sucursal',
  templateUrl: './catalogo_sucursal.component.html',
  styleUrls: ['./catalogo_sucursal.component.css']
})
export class CatalogoSucursalComponent implements OnInit {

  public color = COLOR;
  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  id_empresa = 0;
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  public clientes : any;
  public modal : any;
  public direccion = new Direccion(0,"","","","","","","","","","","");
  public perfil = window.sessionStorage.getItem("perfil");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Sucursal', "Representante", 'Zona', "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  nombre_sucursal = "";
  public sucursal = {
    id_empresa : 0,
    id_sucursal : "",
    id_cliente : "",
    sucursal : "",
    tasa_estatal : 0.00,
    tasa_especial : 0.00,
    zona : "",
    region : "",
    direccion : this.direccion,
    prima_riesgo : 0.00,
    usuario : this.usuario,
    representante : {
      nombre : "",
      rfc : "",
      curp : ""
    },
  };
  public tipo_modal = 0;

  constructor(
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService,
    private sucursal_service : SucursalService,
    private empresa_service: EmpresaService,
    ) { }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }

  mostrarEmpresas(){
    let json = {
      palabra : "",
      taken : 1000,
      status : 2,
      pagina : 0
    };
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresas(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data.registros;
        this.dataSource.paginator = this.paginator;
        this.empresas = object.data.registros;
        this.empresas_busqueda = object.data.registros;
        this.id_empresa = object.data.registros[0].id_empresa;
        this.mostrarSucursales(object.data.registros[0].id_empresa);
        this.filterControlEmpresa.setValue(object.data.registros[0].empresa);
      }
    });
  }

  buscarEmpresa(){
    this.empresas_busqueda = [];
    this.empresas.forEach((element : any) => {
      this.empresas_busqueda.push({
        "empresa" : element.empresa,
        "id_empresa" : element.id_empresa
      });
    });
    if(this.filterControlEmpresa.value.length > 0){
      this.empresas_busqueda = [];
      this.empresas.forEach((element : any) => {
        if(element.empresa.includes(this.filterControlEmpresa.value.toUpperCase())){ 
          this.empresas_busqueda.push({
            "empresa" : element.empresa,
            "id_empresa" : element.id_empresa
          })
        }
      });
    }
  }

  optionEmpresa(value : any){
    this.id_empresa = value.option.id;
    this.mostrarSucursales(value.option.id);
  }

  mostrarSucursales(id_empresa : any){
    this.sucursal_service.obtenerSucursales(id_empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
      }else{
        this.dataSource.data = [];
        Swal.fire("Aviso","No se han encotrado sucursales con está empresa","info");
      }
    });
  }

  mostrarEstado(){
    this.estados_busqueda = [];
    this.estados = [];
    this.compartido_service.obtenerCatalogo("gen_cat_estados")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.estados_busqueda = object;
        this.estados = object;
      }
    });
  }

  buscarEstado(){
    this.estados_busqueda = [];
    this.estados.forEach((element : any) => {
      this.estados_busqueda.push({
        "estado" : element.estado,
        "id_estado" : element.id_estado
      });
    });
    if(this.filterControlEstado.value.length > 0){
      this.estados_busqueda = [];
      this.estados.forEach((element : any) => {
        if(element.estado.includes(this.filterControlEstado.value.toUpperCase())){ 
          this.estados_busqueda.push({
            "estado" : element.estado,
            "id_estado" : element.id_estado
          })
        }
      });
    }
  }

  optionEstado(value : any){
    this.sucursal.direccion.estado = value.option.id;
  }

  mostrarClientes(){
    this.clientes = [];
    this.cliente_service.obtenerClientesPorIdEmpresa(this.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.clientes = object.data;
      }else{
        this.clientes.push({
          "id_cliente" : 0,
          "cliente" : "Está empresa no cuenta con clientes"
        });
      }
    });
  } 

  nuevaSucursal(){
    this.limpiarCampos();
    this.tipo_modal = 1;
    this.mostrarEstado();
    this.mostrarClientes();
    this.openModal();
  }

  visualizar(id_sucursal : any){
    this.sucursal_service.obtenerSucursalPorIdSucursal(id_sucursal)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.limpiarCampos();
        this.tipo_modal = 2;
        this.mostrarClientes();
        this.openModal();
        this.mostrarEstado();
        let sucursal = object.data[0];
        this.sucursal.id_cliente = sucursal.id_cliente;
        this.nombre_sucursal = sucursal.sucursal;
        this.sucursal.id_sucursal = sucursal.id_sucursal;
        this.sucursal.sucursal = sucursal.sucursal;
        this.sucursal.prima_riesgo = sucursal.prima_riesgotrabajo;
        this.sucursal.zona = sucursal.zona;
        this.sucursal.region = sucursal.region;
        this.sucursal.tasa_estatal = sucursal.tasaimpuestoestatal;
        this.sucursal.tasa_especial = sucursal.tasaimpuestoespecial;
        this.sucursal.direccion.id_direccion = sucursal.id_direccion;
        this.sucursal.direccion.calle = sucursal.calle;
        this.sucursal.direccion.numero_exterior = sucursal.numero_exterior;
        this.sucursal.direccion.numero_interior = sucursal.numero_interior;
        this.sucursal.direccion.cruzamiento_uno = sucursal.cruzamiento_uno;
        this.sucursal.direccion.colonia = sucursal.colonia;
        this.sucursal.direccion.codigo_postal = sucursal.codigo_postal;
        this.filterControlEstado.setValue(sucursal.estado);
        this.sucursal.direccion.estado = sucursal.estado;
        this.sucursal.direccion.localidad = sucursal.localidad;
        this.sucursal.direccion.municipio = sucursal.municipio;
        this.sucursal.direccion.descripcion = sucursal.descripcion_direccion;
        this.sucursal.representante.nombre = sucursal.representante_legal;
        this.sucursal.representante.rfc = sucursal.rfc;
        this.sucursal.representante.curp = sucursal.curp;
      }
    });
  }

  guardar(){
    this.sucursal.id_empresa = this.id_empresa;
    if(this.sucursal.id_cliente != "0" && this.sucursal.id_cliente != ""){
      this.confirmar("Confirmación","¿Seguro que deseas actualizar la sucursal?","info",null,2);
    }else{
      Swal.fire("Aviso","Es obligatorio seleccionar el cliente de la sucursal","info");
    }
  }

  altaSucursal(){
    this.sucursal.id_empresa = this.id_empresa;
    if(this.sucursal.id_cliente != "0" && this.sucursal.id_cliente != ""){
      this.confirmar("Confirmación","¿Seguro que deseas dar de alta la sucursal?","info",null,1);
    }else{
      Swal.fire("Aviso","Es obligatorio seleccionar el cliente de la sucursal","info");
    }
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  limpiarCampos(){
    this.sucursal = {
      id_empresa : 0,
      id_sucursal : "",
      id_cliente : "",
      sucursal : "",
      tasa_estatal : 0.00,
      tasa_especial : 0.00,
      zona : "",
      region : "",
      direccion : this.direccion,
      prima_riesgo : 0.00,
      usuario : this.usuario,
      representante : {
        nombre : "",
        rfc : "",
        curp : ""
      },
    };
    this.tipo_modal = 0;
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
        if(tipo == 1){
          this.sucursal_service.crearSucursal(this.sucursal)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha dado de alta correctamente","success");
              this.mostrarSucursales(this.sucursal.id_empresa);
              this.cerrarModal();
            }
          });
        }
        if(tipo == 2){  //Editar
          this.sucursal_service.modificarSucursal(this.sucursal)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha actualizado correctamente","success");
              this.mostrarSucursales(this.sucursal.id_empresa);
            }
          });
        }
      }
    });
  }
}
