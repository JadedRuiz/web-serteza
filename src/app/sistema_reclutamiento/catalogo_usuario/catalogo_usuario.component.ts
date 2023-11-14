import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { COLOR } from 'src/config/config';
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
import { UsuarioService } from 'src/app/services/Reclutamiento/Usuario.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';

@Component({
  selector: 'app-catalogo-usuario',
  templateUrl: './catalogo_usuario.component.html',
  styleUrls: ['./catalogo_usuario.component.css']
})

export class CatalogoUsuarioComponent implements OnInit {

  public color = COLOR;
  displayedColumns: string[] = ['id', 'fotografia', 'nombre', 'usuario', "estatus", "accion"];
  dataSource  = new MatTableDataSource();
  public band = true;
  public show = false;
  public band_persiana = true;
  public foto_user : any;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario_creacion = parseInt(window.sessionStorage.getItem("user")+"");
  public sistema_seleccionado = parseInt(window.sessionStorage.getItem("sistema")+"");
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  //Camera
  @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
  @ViewChild(MatPaginator) paginator : any;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  public modal_camera : any;
  public fotografia = new Fotografia(0,"","","");
  public docB64 = "";
  id_perfil = 0;
  public usuario = {
    id_usuario : "",
    fotografia : {},
    nombre : "",
    usuario : "",
    password : "",
    activo : 1,
    sistemas : [
      {
        id_sistema : 2,
        id_perfil : 0
      }
    ],
    cliente : this.cliente_seleccionado,
    usuario_creacion : this.usuario_creacion
  };
  perfiles : any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  //Autocomplete
  filterControl = new FormControl();
  usuarios_busqueda : any;
  usuarios : any;
  tipo_modal = 0;

  constructor(
    private usuario_service : UsuarioService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private compartido_service : CompartidoService
  ) {
    this.modal = NgbModalRef;
    this.paginator = MatPaginator;
    this.modal_camera = NgbModalRef;
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
   }

  ngOnInit(): void {
    this.mostrarUsuarios();
    this.mostrarPerfiles();
  }

  mostrarPerfiles(){
    this.perfiles = [];
    this.compartido_service.obtenerCatalogo("gen_catperfiles")
    .subscribe((object : any) => {
      if(object.length > 0){
        object.forEach((element : any) => {
          if(this.sistema_seleccionado == element.id_sistema){
            this.perfiles.push(element);
          }
        });
      }
    });
  }

  mostrarUsuarios(){
    this.usuario_service.obtenerUsuariosReclutamiento(this.cliente_seleccionado)
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

  optionUsuario(value : any){
    this.editar(value.option.id);
  }

  nuevoUsuario(){
    this.tipo_modal = 1;
    this.limpiarCampos();
    this.openModal(1);
  }

  altaUsuario(){
    this.usuario.fotografia = this.fotografia;
    this.usuario.sistemas[0].id_perfil = this.id_perfil;
    this.confirmar("Confirmación","¿Seguro que deseas crear un nuevo usuario?","info",null,1);
  }

  editar(id : number){
    this.limpiarCampos();
    this.usuario_service.obtenerUsuariosReclutamientoPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.fotografia.id_fotografia = object.data.id_fotografia;
        this.usuario.id_usuario = object.data.id_usuario;
        this.usuario.nombre = object.data.nombre;
        this.usuario.usuario = object.data.usuario;
        this.usuario.password = object.data.password;
        this.foto_user = object.data.fotografia;
        this.tipo_modal = 2;
        this.id_perfil = object.data.id_perfil;
        this.openModal(1);
      }
    });
  }

  modificarUsuario(){
    this.usuario.fotografia = this.fotografia;
    this.usuario.sistemas[0].id_perfil = this.id_perfil;
    this.confirmar("Confirmación","¿Seguro que deseas modificar al usuario?","info",null,2);
  }

  activarDesactivar(id : number, activo : number){
    let string = "desactivar";
    if(activo == 1){
      string = "activar";
    }
    this.confirmar("Confirmación","¿Seguro que deseas "+string+" a este usuario?","info",{id_usuario : id, activo : activo},3);
  }

  openModal(tipo : number) {
    if(tipo == 1){
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modal_camera = this.modalService.open(this.contenidoDelModalCamera,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : number){
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

  limpiarCampos(){
    this.usuario =  {
      id_usuario : "",
      fotografia : {},
      nombre : "",
      usuario : "",
      password : "",
      activo : 1,
      sistemas : [
        {
          id_sistema : 2,
          id_perfil : 0
        }
      ],
      cliente : this.cliente_seleccionado,
      usuario_creacion : this.usuario_creacion
    };
    this.fotografia = new Fotografia(0,"","","");
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
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
          this.usuario_service.altaUsuarioAdmin(this.usuario)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarUsuarios();
              this.cerrarModal(1);
              Swal.fire("Buen trabajo","Se ha agreado el usuario con exito","success");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.usuario_service.modificarUsuario(this.usuario)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarUsuarios();
              this.cerrarModal(1);
              Swal.fire("Buen trabajo","Se ha modificado el usuario con exito","success");
            }
          });
        }
      }
      if(tipo == 3){
        this.usuario_service.activarDesactivarUsuario(json.id_usuario,json.activo)
        .subscribe((object : any) => {
          if(object.ok){
            this.mostrarUsuarios();
            Swal.fire("Buen trabajo","Se ha actualizado el estatus del usuario","success");
          }
        });
      }
    });
  }
}
