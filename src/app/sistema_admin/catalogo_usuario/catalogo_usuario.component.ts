import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { COLOR } from 'src/config/config';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { Usuario } from 'src/app/models/Usuario';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { Fotografia } from 'src/app/models/Fotografia';
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  public show = false;
  public band_persiana = true;
  public foto_user : any;
  public sistemas_seleccionados : any;
  public usuario_creacion = window.sessionStorage.getItem("user");
  public modal : any;
  public texto_modal = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public activo = true;
  public empresa_seleccionada = window.sessionStorage.getItem("empresa");
  public tipo_modal = 0;
  //Filtros
  public filtros = {
    taken : 5,
    status : 2,
    palabra : ""
  };
  //Camera
  @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  public modal_camera : any;
  public fotografia = new Fotografia(0,"","","");
  public docB64 = "";
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  //Autocomplete
  myControl = new FormControl();
  usuarios_busqueda : any;
  displayedColumns: string[] = ['id', 'fotografia', 'nombre', 'usuario', "estatus", "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  filterControl = new FormControl();

  constructor(
    private usuario_service : UsuarioService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {
    this.sistemas_seleccionados = [];
    this.modal = NgbModalRef;
    this.modal_camera = NgbModalRef;
    this.paginator = MatPaginator;
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
   }

  ngOnInit(): void {
    this.mostrarUsuarios();
    this.obtenerSistemas();
  }

  mostrarUsuarios(){
    this.usuario_service.obtenerUsuarios(this.filtros)
    .subscribe((object : any)  => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
        this.usuarios = object.data;
        this.usuarios_busqueda = object.data;
      }
    });
  }

  buscarUsuario(){
    this.usuarios_busqueda = [];
    this.usuarios.forEach((element : any) => {
      this.usuarios_busqueda.push({
        "nombre" : element.nombre,
        "id_usuario" : element.id_usuario
      });
    });
    if(this.filterControl.value.length > 0){
      this.usuarios_busqueda = [];
      this.usuarios.forEach((element : any) => {
        if(element.nombre.includes(this.filterControl.value.toUpperCase())){ 
          this.usuarios_busqueda.push({
            "nombre" : element.nombre,
            "id_usuario" : element.id_usuario
          })
        }
      });
    }
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
          activo : active,
          fotografia : this.fotografia
        };
        this.confirmar("Confirmación","¿Seguro que desea guardar la información?","info",json,1);
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
          password : this.usuario.password,
          sistemas : this.sistemas_seleccionados,
          usuario_creacion : this.usuario_creacion,
          activo : active,
          fotografia : this.fotografia
        };
        this.confirmar("Confirmación","¿Seguro que desea editar la información?","info",json,2);
      }
    }
  }
  nuevoUsuario(){
    this.texto_modal = "Nuevo usuario";
    this.openModal(1);
    jQuery("#editar").hide();
    jQuery("#guardar").show();
  }

  optionUsuario(value : any){
    this.editar(value.option.id);
  }

  editar(folio : any){
    this.usuario_service.obtenerUsuarioPorId(folio)
    .subscribe( (object : any) => {
      if(object.ok){
        this.texto_modal = "Editar usuario";
        this.openModal(1);
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
        //Se pinta la imagen
        this.fotografia.id_fotografia = object.data[0].id_fotografia;
        this.foto_user = object.data[0].fotografia;
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

  activarDesactivar(id : number, activo : number){
    let string = "desactivar";
    if(activo == 1){
      string = "activar";
    }
    this.confirmar("Confirmación","¿Seguro que deseas "+string+" a este usuario?","info",{id_usuario : id, activo : activo},3);
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
    this.fotografia = new Fotografia(0,"","","");
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
    this.usuario = new Usuario(0,"","","","",0);
    this.sistemas_seleccionados = [];
  }

  openModal(tipo : any) {
    this.limpiarCampos();
    if(tipo == 1){
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modal_camera = this.modalService.open(this.contenidoDelModalCamera,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : any){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modal_camera.close();
    }
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

  takeSnapshot(): void {
    let foto = this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    this.getPicture.emit(webcamImage);
    this.showWebcam = false;
    this.foto_user = webcamImage.imageAsDataUrl;
    let docB64 = this.foto_user.split(",");
    this.fotografia.docB64 = docB64[1];
    this.fotografia.extension = "jpeg";
    this.fotografia.nombre = "foto_user";
    this.cerrarModal(2);
    // console.log(webcamImage.imageAsDataUrl)
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
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
          this.usuario_service.altaUsuarioAdmin(json)
          .subscribe( (object) =>{
            if(object.ok){
              this.limpiarCampos();
              this.mostrarUsuarios();
              Swal.fire("Buen trabajo","El usuario se ha dado de alta correctamente","success");
              this.cerrarModal(1);
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
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
    });
  }
}
