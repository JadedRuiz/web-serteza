import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { Empresa } from 'src/app/models/Empresa';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-catalogo-empresa',
  templateUrl: './catalogo_empresa.component.html',
  styleUrls: ['./catalogo_empresa.component.css']
})
export class CatalogoEmpresaComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public usuario_creacion = parseInt(window.sessionStorage.getItem("user")+"");
  public direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public empresa = new Empresa(0,1,"","","","",this.usuario_creacion,this.direccion,this.fotografia,1);
  public empresas : any;
  public band = true;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public activo = true;
  public foto_user : any;
  public docB64 = "";
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
    private empresa_service: EmpresaService,
    private sanitizer: DomSanitizer
  ) {
    this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
   }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }
  mostrarEmpresas(){
    let json = {
      palabra : this.palabra,
      taken : this.taken,
      status : this.status,
      pagina : this.pagina_actual
    };
    this.empresas = [];
    this.empresa_service.obtenerEmpresas(json)
    .subscribe( (object : any) =>{
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
            this.empresas.push({
              "folio" : object.data.registros[i].id_empresa,
              "cliente" : object.data.registros[i].empresa,
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
    if(this.empresa.empresa == "" || this.empresa.rfc == "" || this.empresa.razon_social == ""){
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
            title: '¿Estas seguro de agregar una empresa sin ningun dato de dirección?',
            text: "El empresa se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
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
          if(this.fotografia.docB64 == ""){
            Swal.fire({
              title: '¿Estas seguro de agregar una empresa sin ningun logo?',
              text: "La empresa se registrará sin logo, pero puedes actulizar su información en cualquier momento",
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
                this.empresa.activo = 0;
              }
              this.empresa.usuario_creacion = parseInt(this.usuario_creacion+"");
              this.empresa_service.altaEmpresa(this.empresa)
              .subscribe( (object) =>{
                if(object.ok){
                  console.log(object);
                  this.limpiarCampos();
                  this.mostrarEmpresas();
                  Swal.fire("Buen trabajo","La empresa se ha dado de alta correctamente","success");
                  this.cerrarModal();
                }else{
                  Swal.fire("Ha ocurrido un error",object.message,"error");
                }
              });
            }
          }
        }
      }
    }
  }

  modificarUsuario(){
    let band = true;
    if(this.empresa.empresa == "" || this.empresa.rfc == "" || this.empresa.razon_social == ""){
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
            title: '¿Estas seguro de modificar una empresa sin ningun dato de dirección?',
            text: "El empresa se modificará sin domicilio, pero puedes actulizar su información en cualquier momento",
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
          if(this.fotografia.docB64 == ""){
            Swal.fire({
              title: '¿Estas seguro de modificar una empresa sin ningun logo?',
              text: "La empresa se modificará sin logo, pero puedes actulizar su información en cualquier momento",
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
                this.empresa.activo = 0;
              }
              this.empresa.usuario_creacion = parseInt(this.usuario_creacion+"");
              this.empresa_service.actualizarEmpresa(this.empresa)
              .subscribe( (object) =>{
                if(object.ok){
                  console.log(object);
                  this.mostrarEmpresas();
                  Swal.fire("Buen trabajo","La empresa se ha modificado correctamente","success");
                }else{
                  Swal.fire("Ha ocurrido un error",object.message,"error");
                }
              });
            }
          }
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
    this.empresa_service.obtenerEmpresaPorId(folio)
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object.data[0]);
        this.openModal();
        
        this.empresa.direccion.id_direccion = object.data[0].id_direccion;
        this.empresa.direccion.calle = object.data[0].calle;
        this.empresa.direccion.numero_exterior = object.data[0].numero_exterior;
        this.empresa.direccion.numero_interior = object.data[0].numero_interior;
        this.empresa.direccion.cruzamiento_uno = object.data[0].cruzamiento_uno;
        this.empresa.direccion.cruzamiento_dos = object.data[0].cruzamiento_dos;
        this.empresa.direccion.codigo_postal = object.data[0].codigo_postal;
        this.empresa.direccion.colonia = object.data[0].colonia;
        this.empresa.direccion.localidad = object.data[0].localidad;
        this.empresa.direccion.municipio = object.data[0].municipio;
        this.empresa.direccion.estado = object.data[0].estado;
        this.empresa.direccion.descripcion = object.data[0].descripcion_direccion;
        this.empresa.id_empresa = object.data[0].id_empresa;
        this.empresa.empresa = object.data[0].empresa;
        this.empresa.razon_social = object.data[0].razon_social;
        this.empresa.descripcion = object.data[0].descripcion;
        this.empresa.rfc = object.data[0].rfc;
        this.empresa.usuario_creacion = this.usuario_creacion;
        this.fotografia.id_fotografia = object.data[0].id_fotografia;
        if(object.data[0].fotografia != ""){
          this.mostrarImagen(object.data[0].fotografia,object.data[0].extension);
        }
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
    this.direccion  = new Direccion(0,0,"","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","",""); 
    this.empresa = new Empresa(0,1,"","","","",this.usuario_creacion,this.direccion,this.fotografia,1);
    this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
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
    this.mostrarEmpresas();
  }

  filtroStatus(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarEmpresas();
  }

  busqueda(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarEmpresas();
  }
  getDatos(){
    this.cp_service.getDirrecion(this.empresa.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.empresa.direccion.estado = data[0].response.estado;
        this.empresa.direccion.municipio = data[0].response.municipio;
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
    let colonia = this.empresa.direccion.colonia;
    this.cp_service.getDirrecion(this.empresa.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.empresa.direccion.estado = data[i].response.estado;
            this.empresa.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }

  subirImagen(){
      document.getElementById("foto_user")?.click();
  }

  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      this.fotografia.extension = extension;
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta+"";
          this.fotografia.docB64 = respuesta+"";
          this.fotografia.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
  }
}
