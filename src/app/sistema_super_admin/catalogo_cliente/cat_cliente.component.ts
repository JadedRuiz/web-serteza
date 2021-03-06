import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { Cliente } from 'src/app/models/Cliente';
import { Direccion } from 'src/app/models/Direccion';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-candidatos',
  templateUrl: './cat_cliente.component.html',
  styleUrls: ['./cat_cliente.component.css']
})
export class CatalogoClienteComponent implements OnInit {
  //Variables globales
  public color = COLOR;
  public direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  public cliente = new Cliente(0,"","","",0,0,this.direccion,1);
  public clientes : any;
  public sistemas : any;
  public band = true;
  public sistemas_seleccionados : any;
  public usuario_creacion = window.sessionStorage.getItem("user");
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public activo = true;
  //Filtros
  public taken = 5; //Registros por default
  public status = 2; //Status default
  public palabra = "";
  //Paginacion
  public total_registros = 0;
  public mostrar_pagination = false;
  public paginas_a_mostrar = 5;
  public paginas : any;
  public pagina_actual = 0;
  public limite_inferior = 0;
  public limite_superior = this.paginas_a_mostrar;
  public next = false;
  public previous = false;
  
  colonias = [
    "Primero ingresa el Codigo Postal"
  ];

  constructor( 
    private modalService: NgbModal,
    public cp_service: LocalidadService,
    private cliente_service: ClienteService
  ) { }

  ngOnInit(): void {
    this.mostrarClientes();
  }
  mostrarClientes(){
    let json = {
      palabra : this.palabra,
      taken : this.taken,
      status : this.status,
      pagina : this.pagina_actual
    };
    this.clientes = [];
    console.log(json);
    this.cliente_service.obtenerClientes(json)
    .subscribe( (object : any) =>{
        console.log(object);
        if(object.ok){
          //Mostrar si los registros son mayores a los registros que se muestran
          this.total_registros = object.data.total;
          if(this.total_registros > this.taken){
            this.mostrar_pagination = true;
            this.paginar();
          }else{
            this.mostrar_pagination = false;
          }
          //Mostrar usuarios
          this.band = true;
          //LLenar los usuarios en la tabla
          for(let i =0; i<object.data.registros.length; i++){
            let status = "Activo";
            if(object.data.registros[i].activo == 0){
              status = "Desactivado";
            }
            this.clientes.push({
              "folio" : object.data.registros[i].id_cliente,
              "cliente" : object.data.registros[i].cliente,
              "status" : status
            });
          }
        }else{
          this.band = false;
        }
    });
  }

  altaCliente(){
    let band = true;
    if(this.cliente.cliente == "" || this.cliente.contacto == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == 0 && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar un cliente sin ningun dato de dirección?',
            text: "El cliente se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText : "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              band = true;
            }else{
              band = false;
            }
          });
      }else{
        if(band){
          if(!this.activo){
            this.cliente.activo = 0;
          }
          this.cliente.usuario_creacion = parseInt(this.usuario_creacion+"");
          this.cliente_service.altaCliente(this.cliente)
          .subscribe( (object) =>{
            if(object.ok){
              this.limpiarCampos();
              this.mostrarClientes();
              Swal.fire("Buen trabajo","El cliente se ha dado de alta correctamente","success");
              this.cerrarModal();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    }
  }
  modificarUsuario(){
    let band = true;
    if(this.cliente.cliente == "" || this.cliente.contacto == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == 0 && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar un cliente sin ningun dato de dirección?',
            text: "El cliente se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText : "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              band = true;
            }else{
              band = false;
            }
          });
      }else{
        if(band){
          if(!this.activo){
            this.cliente.activo = 0;
          }
          this.cliente.usuario_creacion = parseInt(this.usuario_creacion+"");
          this.cliente_service.actualizarCliente(this.cliente)
          .subscribe( (object) =>{
            if(object.ok){
              this.mostrarClientes();
              Swal.fire("Buen trabajo","El usuario se ha dado de alta correctamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    }
  }
  guardar(){
    this.openModal();
    jQuery("#editar").hide();
    jQuery("#guardar").show();
  }
  editar(folio : any){
    this.cliente_service.obtenerClientesPorId(folio)
    .subscribe( (object : any) => {
      if(object.ok){
        this.openModal();
        //Se llena la informacion en el modal
        this.direccion = new Direccion(
          object.data[0].id_direccion,
          object.data[0].calle,
          object.data[0].numero_exterior,
          object.data[0].numero_interior,
          object.data[0].cruzamiento_uno,
          object.data[0].cruzamiento_dos,
          object.data[0].codigo_postal,
          object.data[0].colonia,
          object.data[0].localidad,
          object.data[0].municipio,
          object.data[0].estado,
          object.data[0].descripcion_direccion
        );
        this.cliente = new Cliente(
          object.data[0].id_cliente,
          object.data[0].cliente,
          object.data[0].contacto,
          object.data[0].descripcion,
          0,parseInt(this.usuario_creacion+""),
          this.direccion,
          1
        )
        if(object.data[0].activo == 1){
          this.activo = true;
        }else{
          this.activo = false;
        }
        //Funcionalidad de modal
        jQuery("#guardar").hide();
        jQuery("#editar").show();
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }

  limpiarCampos(){
    this.direccion = new Direccion(0,0,"","","","","","","","","","");
    this.cliente = new Cliente(0,"","","",0,0,this.direccion,1);
    this.sistemas_seleccionados = [];
  }

  openModal() {
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
  
  paginar(){
    this.paginas = [];
    let paginas_a_pintar = parseInt(this.total_registros+"")%parseInt(this.taken+"");
    if(paginas_a_pintar == 0){
      paginas_a_pintar = (parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+"");
    }else{
      paginas_a_pintar = ((parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+""))+1;
    }
    //Pintamos las flechas
    if(paginas_a_pintar > this.paginas_a_mostrar){
      this.next = true;
    }
    if(this.pagina_actual == paginas_a_pintar){
      this.next = false;
    }
    if(this.pagina_actual > this.paginas_a_mostrar){
      this.previous = true;
    }
    if(this.pagina_actual == 0){
      this.previous = false;
    }
    //Pintamos las paginas
    for(let i =0;i<this.paginas_a_mostrar;i++){
      let pagina_inicial = this.limite_inferior;
      if(i<paginas_a_pintar){
        if(this.pagina_actual == pagina_inicial+i){
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : "active"
          });
        }else{
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : ""
          });
        }
      }
    }
  }

  irPagina(pagina : any){
    this.pagina_actual = pagina;
    this.mostrarClientes();
  }

  filtroStatus(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarClientes();
  }

  busqueda(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarClientes();
  }
  getDatos(){
    this.cp_service.getDirrecion(this.cliente.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.cliente.direccion.estado = data[0].response.estado;
        this.cliente.direccion.municipio = data[0].response.municipio;
        this.colonias = [];
        for(let i=0;i<data.length;i++){
          this.colonias.push(data[i].response.asentamiento);
        }
      }
    },
    (error : any) => {
      Swal.fire('Ha ocurrido un error','No se han encontrado resultados', 'warning');
    });
  }

  modificarMunicipio(){
    let colonia = this.cliente.direccion.colonia;
    this.cp_service.getDirrecion(this.cliente.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.cliente.direccion.estado = data[i].response.estado;
            this.cliente.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }
}
