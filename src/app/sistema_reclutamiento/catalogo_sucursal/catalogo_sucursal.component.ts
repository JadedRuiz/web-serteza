import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  public estados : any;
  public clientes : any;
  public modal : any;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Sucursal', "Representante", 'Zona', "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  nombre_sucursal = "";
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
  public tipo_modal = 1;

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
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
    .subscribe((object : any) => {
      if(object.ok){
        this.mostrarSucursales(object.data[0].id_empresa);
        this.empresas = object.data;
        this.empresas_busqueda = object.data;
        this.filterControlEmpresa.setValue(object.data[0].empresa);
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
    this.mostrarSucursales(value.option.id);
  }

  mostrarSucursales(id_empresa : any){
    this.sucursal_service.obtenerSucursales(id_empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  visualizar(id_sucursal : any){
    this.sucursal_service.obtenerSucursalPorIdSucursal(id_sucursal)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.openModal();
        let sucursal = object.data[0];
        this.nombre_sucursal = sucursal.sucursal;
      }
    });
  }

  guardar(){
    this.tipo_modal = 1;
    this.openModal();
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
        if(tipo == 2){  //Editar
          
        }
      }
    });
  }
}
