import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Usuario } from 'src/app/models/Usuario';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { Fotografia } from 'src/app/models/Fotografia';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-catalogo-usuario',
  templateUrl: './catalogo_usuario.component.html',
  styleUrls: ['./catalogo_usuario.component.css']
})
export class CatalogoUsuarioComponent implements OnInit {

  public color = COLOR;
  public usuario = new Usuario(0,"","","","",0);
  public usuarios : any;
  public sistemas : any;
  public band = true;
  public show = false;
  public band_persiana = true;
  public foto_user : any;
  public sistemas_seleccionados : any;
  public usuario_creacion = window.sessionStorage.getItem("user");
  public modal : any;
  public modal_camera : any;
  public fotografia = new Fotografia(0,"","","");
  public docB64 = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
  public activo = true;
  public empresa_seleccionada = window.sessionStorage.getItem("empresa");
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

  constructor(
    private usuario_service : UsuarioService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {
    this.sistemas_seleccionados = [];
    this.modal = NgbModalRef;
    this.modal_camera = NgbModalRef;
    this.paginas = [];
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
   }

  ngOnInit(): void {
    this.mostrarUsuarios();
    this.obtenerSistemas();
  }

  mostrarUsuarios(){
    let json = {
      palabra : this.palabra,
      taken : this.taken,
      status : this.status,
      pagina : this.pagina_actual,
      id_entidad : this.empresa_seleccionada,
      tipo_entidad : 1
    };
    this.usuarios = [];
    this.usuario_service.obtenerUsuariosDeEntidad(json)
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
            this.usuarios.push({
              "folio" : object.data.registros[i].id_usuario,
              "nombre" : object.data.registros[i].nombre,
              "status" : status
            });
          }
        }else{
          this.band = false;
        }
    });
  }

  altaUsuario(){
    if(this.usuario.nombre == "" || this.usuario.usuario == "" || this.usuario.password == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(this.sistemas_seleccionados.length == 0){
        Swal.fire("Ha ocurrido un error","Debes seleccionar almenos un sistema","error");
      }else{
        let active = 1;
        if(!this.activo){
          active = 0;
        }
        let json = {
          nombre :  this.usuario.nombre,
          usuario : this.usuario.usuario,
          password : this.usuario.usuario,
          sistemas : this.sistemas_seleccionados,
          usuario_creacion : this.usuario_creacion,
          id_empresa : this.empresa_seleccionada,
          activo : active
        };
        this.usuario_service.altaUsuarioAdmin(json)
        .subscribe( (object) =>{
          if(object.ok){
            this.limpiarCampos();
            this.mostrarUsuarios();
            Swal.fire("Buen trabajo","El usuario se ha dado de alta correctamente","success");
            this.cerrarModal();
          }else{
            Swal.fire("Ha ocurrido un error",object.message,"error");
          }
        });
      }
    }
  }
  modificarUsuario(){
    if(this.usuario.nombre == "" || this.usuario.usuario == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(this.sistemas_seleccionados.length == 0){
        Swal.fire("Ha ocurrido un error","Debes seleccionar almenos un sistema","error");
      }else{
        let active = 1;
        if(!this.activo){
          active = 0;
        }
        let json = {
          id_usuario : this.usuario.id_usuario,
          nombre :  this.usuario.nombre,
          usuario : this.usuario.usuario,
          password : this.usuario.usuario,
          sistemas : this.sistemas_seleccionados,
          usuario_creacion : this.usuario_creacion,
          activo : active
        };
        this.usuario_service.modificarUsuario(json)
        .subscribe( (object) =>{
          if(object.ok){
            this.mostrarUsuarios();
            Swal.fire("Buen trabajo","El usuario se ha modificado correctamente","success");
          }else{
            Swal.fire("Ha ocurrido un error",object.message,"error");
          }
        });
      }
    }
  }
  guardar(){
    this.openModal();
    jQuery("#editar").hide();
    jQuery("#guardar").show();
  }
  editar(folio : any){
    this.usuario_service.obtenerUsuarioPorId(folio)
    .subscribe( (object : any) => {
      if(object.ok){
        this.openModal();
        //Se llena la informacion en el modal
        this.usuario.id_usuario = parseInt(object.data[0].id_usuario);
        this.usuario.nombre = object.data[0].nombre;
        this.usuario.usuario = object.data[0].usuario;
        this.usuario.password = object.data[0].password;
        if(object.data[0].activo == 1){
          this.activo = true;
        }else{
          this.activo = false;
        }
        //Funcionalidad de modal
        jQuery("#guardar").hide();
        jQuery("#editar").show();
        //Se llenan los sistemas
        this.sistemas_seleccionados = [];
        for(let i=0;i<object.data[0].sistemas.length; i++){
          this.sistemas_seleccionados.push(object.data[0].sistemas[i].id_sistema);
          for(let o=0; o<this.sistemas.length;o++){
            if(this.sistemas[o].id_sistema == object.data[0].sistemas[i].id_sistema){
              this.sistemas[o].active = "active";
            }
          }
        }
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }

  seleccionar(id_sistema : any){
    if(this.sistemas_seleccionados.includes(id_sistema)){
      this.sistemas_seleccionados.splice(this.sistemas_seleccionados.indexOf(id_sistema),1);
      jQuery("#sistema_"+id_sistema).removeClass("active");
    }else{
      this.sistemas_seleccionados.push(id_sistema);
      jQuery("#sistema_"+id_sistema).addClass("active");
    }
  }

  limpiarActive(){
    for(let o=0; o<this.sistemas.length;o++){
      this.sistemas[o].active = " ";
    }
  }

  obtenerSistemas(){
    this.sistemas = [];
    this.usuario_service.obtenerSistemasAdmin(this.usuario_creacion)
    .subscribe( (object : any) =>{
      if(object.ok){
        if(object.data.length > 0){
          for(let i=0;i<object.data.length;i++){
            this.sistemas.push({
              "id_sistema" : object.data[i].id_sistema,
              "sistema" : object.data[i].sistema,
              "active" : "",
            });
          }
        }
      }
    });
  }

  limpiarCampos(){
    this.usuario = new Usuario(0,"","","","",0);
    this.sistemas_seleccionados = [];
  }

  openModal() {
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    this.limpiarActive();
  }

  openModalCamera(){
    this.modal_camera = this.modalService.open(this.contenidoDelModalCamera,{ size: 'sm', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  cerrarModalCamera(){
    this.modal_camera.close();
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
    this.mostrarUsuarios();
  }

  filtroStatus(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarUsuarios();
  }

  busqueda(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    this.mostrarUsuarios();
  }

  mostrarPersiana(){
    this.band_persiana = false;
  }

  ocultarPersiana(){
    this.band_persiana = true;
  }

  subirImagen(){
    document.getElementById("foto_user")?.click();
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

  mostrarPassword(){
    this.show = !this.show;
  }
}
