import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { COLOR } from 'src/config/config';
import * as jQuery from 'jquery';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedimiento-usuario',
  templateUrl: './procedimiento_usuario.component.html',
  styleUrls: ['./procedimiento_usuario.component.css']
})
export class ProcedimientoUsuarioComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public band  = true;
  public usuarios : any;
  public palabra = "";
  public id_seleccionado = "";
  public bandera_empresa = false;
  public bandera_cliente = false;
  public modal : any;
  public arreglo : any;
  public empresas_configuradas : any;
  public clietes_configurados : any;
  public empresas_seleccionadas : any;
  public clietes_seleccionados : any;
  public usuario_creacion = window.sessionStorage.getItem("user");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  //Variables de manipulacion del modal
  public titulo_modal = "";
  public tipo_modal = 0;

  constructor(
    private usuario_service : UsuarioService,
    private empresa_service : EmpresaService,
    private cliente_service : ClienteService,
    private modalService: NgbModal
  ) {
    this.clietes_seleccionados = [];
    this.empresas_seleccionadas = [];
    this.modal = NgbModalRef;
   }

  ngOnInit(): void {
    this.mostrarUsuarios();
  }

  mostrarUsuarios(){
    let json = {
      palabra : this.palabra,
      taken : 1000,
      status : 2,
      pagina : 0
    };
    this.usuarios = [];
    console.log(json);
    this.usuario_service.obtenerUsuarios(json)
    .subscribe( (object : any) =>{
        if(object.ok){
          
          //Mostrar usuarios
          this.band = true;
          //LLenar los usuarios en la tabla
          for(let i =0; i<object.data.registros.length; i++){
            if(object.data.registros[i].activo == 1){
              this.usuarios.push({
                "folio" : object.data.registros[i].id_usuario,
                "nombre" : object.data.registros[i].nombre,
                "status" : status
              });
            }
            
          }
        }else{
          this.band = false;
        }
    });
  }
  mostrarEmpresasPorUsuario(id_usuario : any){
    this.empresas_configuradas = [];
    this.empresa_service.obtenerEmpresaPorIdUsuario(id_usuario)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.bandera_empresa = true;
        for(let i=0;i<object.data.length;i++){
          this.empresas_configuradas.push({
            "folio" : object.data[i].id_empresa,
            "nombre" : object.data[i].empresa
          });
        }
      }else{
        this.bandera_empresa = false;
      }
    });
  }
  mostrarClientePorIdUsuario(id_usuario : any){
    this.clietes_configurados = [];
    this.cliente_service.obtenerClientePorIdUsuario(id_usuario)
    .subscribe( (object : any) => {
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          this.clietes_configurados.push({
            "folio" : object.data[i].id_cliente,
            "nombre" : object.data[i].cliente
          });
        }
        this.bandera_cliente = true;
      }else{
        this.bandera_cliente = false;
      }
    });
  }
  busqueda(){
    this.mostrarUsuarios();
  }
  seleccionar(folio : any,usuario : any){
    jQuery(".list-group-item").each(function(){
      $(this).removeClass("active");
    });
    jQuery("#usuario_"+folio).addClass("active");
    this.id_seleccionado = folio;
    this.mostrarEmpresasPorUsuario(this.id_seleccionado);
    this.mostrarClientePorIdUsuario(this.id_seleccionado);
  }

  seleccionarEnModal(folio : any){
     if(jQuery("#arreglo"+folio).hasClass("active")){
      jQuery("#arreglo"+folio).removeClass("active");
      if(this.tipo_modal == 1){
        let index = this.arreglo.indexOf(folio);
        this.empresas_seleccionadas.splice(index,1);
      }
      if(this.tipo_modal == 2){
        let index = this.arreglo.indexOf(folio);
        this.clietes_seleccionados.splice(index,1);
      }
     }else{ 
      jQuery("#arreglo"+folio).addClass("active");
      if(this.tipo_modal == 1){
        this.empresas_seleccionadas.push(folio);
      }
      if(this.tipo_modal == 2){
        this.clietes_seleccionados.push(folio);
      }
     }
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    this.limpiarRegistros();
  }

  cerrarModal(){
    this.modal.close();
  }
  mostrarEmpresas(){
    this.arreglo = [];
    let json = {
      "palabra" : this.palabra,
      "taken" : 1000,
      "pagina" : 0,
      "status" : 2 
    };
    this.empresa_service.obtenerEmpresas(json)
    .subscribe( (object : any) =>{
      if(object.ok){
        for(let i=0;i<object.data.registros.length; i++){
          let band = false;
          for(let o=0; o<this.empresas_configuradas.length;o++){
            if(this.empresas_configuradas[o].folio == object.data.registros[i].id_empresa){
              band = true;
            }
          }
          if(band){
            this.arreglo.push({
              "nombre" : object.data.registros[i].empresa,
              "folio" : object.data.registros[i].id_empresa,
              "atributo" : "disabled"
            });
          }else{
            this.arreglo.push({
              "nombre" : object.data.registros[i].empresa,
              "folio" : object.data.registros[i].id_empresa,
              "atributo" : ""
            });
          }
        }
      }
    });
  }
  mostrarClientes(){
    this.arreglo = [];
    let json = {
      "palabra" : this.palabra,
      "taken" : 1000,
      "pagina" : 0,
      "status" : 2 
    };
    this.cliente_service.obtenerClientes(json)
    .subscribe( (object : any) =>{
      if(object.ok){
        console.log(this.clietes_configurados);
        for(let i=0;i<object.data.registros.length; i++){
          let band = false;
          for(let o=0; o<this.clietes_configurados.length;o++){
            if(this.clietes_configurados[o].folio == object.data.registros[i].id_cliente){
              band = true;
            }
          }
          if(band){
            this.arreglo.push({
              "nombre" : object.data.registros[i].cliente,
              "folio" : object.data.registros[i].id_cliente,
              "atributo" : "disabled"
            });
          }else{
            this.arreglo.push({
              "nombre" : object.data.registros[i].cliente,
              "folio" : object.data.registros[i].id_cliente,
              "atributo" : ""
            });
          }
        }
      }
    });
  }

  nuevoCliente(){
    this.mostrarClientes();
    this.titulo_modal = "Agregar clientes";
    this.tipo_modal = 2;
    this.openModal();
  }

  nuevaEmpresa(){
    this.mostrarEmpresas();
    this.titulo_modal = "Agregar empresas";
    this.openModal();
    this.tipo_modal = 1;
  }
  limpiarRegistros(){
    this.empresas_seleccionadas = [];
    this.clietes_seleccionados = [];
  }
  altaRegistro(){
    if(this.tipo_modal == 1){
      if(this.empresas_seleccionadas.length == 0){
        Swal.fire("Ha ocurrido un error","Primero selecciona las empresas a agreagarle al usuario","error");
      }else{
        let json = {
          id_usuario : this.id_seleccionado,
          id_empresa : this.empresas_seleccionadas,
          usuario_creacion : this.usuario_creacion
        };
        this.empresa_service.asignarEmpresaAUsuario(json)
        .subscribe( (object : any)=> {
          if(object.ok){
            Swal.fire("Buen trabajo","Se han agregado las empresas seleccionadas al usuario","success");
            this.mostrarEmpresasPorUsuario(this.id_seleccionado);
            this.cerrarModal();
          }
        });
      }
    }
    if(this.tipo_modal == 2){
      console.log(this.clietes_seleccionados);
      if(this.clietes_seleccionados.length == 0){
        Swal.fire("Ha ocurrido un error","Primero selecciona los clientes a agreagarle al usuario","error");
      }else{
        let json = {
          id_usuario : this.id_seleccionado,
          id_cliente : this.clietes_seleccionados,
          usuario_creacion : this.usuario_creacion
        };
        this.cliente_service.asignarClienteAUsuario(json)
        .subscribe( (object : any)=> {
          if(object.ok){
            Swal.fire("Buen trabajo","Se han agregado los clientes seleccionadas al usuario","success");
            this.mostrarClientePorIdUsuario(this.id_seleccionado);
            this.cerrarModal();
          }
        });
      }
    }
  }
}
