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
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';

@Component({
  selector: 'app-catalogo-usuario',
  templateUrl: './catalogo_usuario.component.html',
  styleUrls: ['./catalogo_usuario.component.css']
})
export class CatalogoUsuarioComponent implements OnInit {

  public color = COLOR;
  public fotografia = new Fotografia(0,"","","");
  public usuario_creacion = window.sessionStorage.getItem("user");
  public usuario = {
    id_usuario : 0,
    fotografia : this.fotografia,
    nombre : "",
    usuario : "",
    password : "",
    sistemas : [],
    empresas : [],
    clientes : [],
    usuario_creacion : parseInt(""+this.usuario_creacion)
  };
  public usuarios : any;
  public sistemas : any;
  public sist3m4s_copia : any;
  public show = false;
  public band_persiana = true;
  public foto_user : any;
  public sistemas_seleccionados : any;
  public perfiles_x_sistema : any;
  public empresas : any;
  public empresas_busqueda : any;
  public empresas_seleccionadas : any;
  public clientes : any;
  public clientes_busqueda : any;
  public clientes_seleccionados : any;
  public busqueda : any;
  public modal : any;
  public texto_modal = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public activo = true;
  public empresa_seleccionada = window.sessionStorage.getItem("empresa");
  public tipo_modal = 0;
  public sistema_config = 0;
  public perfil = 0;
  public filtros = {
    taken : 1000,
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
  show_nominas = false;

  constructor(
    private usuario_service : UsuarioService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService,
    private empresa_service : EmpresaService
  ) {
    this.sistemas_seleccionados = [];
    this.empresas_seleccionadas = [];
    this.clientes_seleccionados = [];
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
        this.dataSource.data = object.data.registros;
        this.dataSource.paginator = this.paginator;
        this.usuarios = object.data.registros;
        this.usuarios_busqueda = object.data.registros;
      }
    });
  }

  mostrarClientes(){
    this.clientes = [];
    this.clientes_busqueda = [];
    let json = {
      taken : 1000,
      palabra : "",
      status : "2",
      pagina : 0
    }
    this.cliente_service.obtenerClientes(json)
    .subscribe((object : any) =>{
      this.clientes = object.data.registros;
      this.clientes_busqueda = object.data.registros;
      // this.pintarEntidades(this.sistema_config);
    });
  }

  mostrarEmpresas(){
    this.empresas = [];
    this.empresas_busqueda = [];
    let json = {
      taken : 1000,
      palabra : "",
      status : "2",
      pagina : 0
    }
    this.empresa_service.obtenerEmpresas(json)
    .subscribe((object : any) =>{
      this.empresas = object.data.registros;
      this.empresas_busqueda = object.data.registros;
      // this.pintarEntidades(this.sistema_config);
    });
  }

  buscarUsuario(){
    this.usuarios_busqueda = [];
    this.usuarios.forEach((element : any) => {
      this.usuarios_busqueda.push({
        "usuario_completo" : element.usuario_completo,
        "id_usuario" : element.id_usuario
      });
    });
    if(this.filterControl.value.length > 0){
      this.usuarios_busqueda = [];
      this.usuarios.forEach((element : any) => {
        if(element.usuario_completo.includes(this.filterControl.value.toUpperCase())){ 
          this.usuarios_busqueda.push({
            "usuario_completo" : element.usuario_completo,
            "id_usuario" : element.id_usuario
          })
        }
      });
    }
  }
  
  altaUsuario(){
    this.usuario.sistemas = this.sistemas_seleccionados;
    this.usuario.empresas = this.empresas_seleccionadas;
    this.usuario.clientes = this.clientes_seleccionados;
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta a un nuevo usuario?","info",this.usuario,1)
  }

  modificarUsuario(){
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
        this.usuario.sistemas = this.sistemas_seleccionados;
        this.usuario.empresas = this.empresas_seleccionadas;
        this.usuario.clientes = this.clientes_seleccionados;
        this.confirmar("Confirmación","¿Seguro que desea editar la información?","info",this.usuario,2);
      }
    }
  }

  nuevoUsuario(){
    this.obtenerSistemas();
    this.openModal(1);
    this.tipo_modal = 1;
  }

  optionUsuario(value : any){
    this.editar(value.option.id);
  }

  setSistema(value : any){
    if(value.option.selected){
      this.sistemas_seleccionados.push({
        id_sistema : value.option.value,
        id_perfil : 0
      });
    }else{
      this.sistemas_seleccionados.forEach((element : any, index : any) => {
        if(element.id_sistema == value.option.value){
          this.sistemas_seleccionados.splice(index,1);
        }
      });
      this.sistemas.forEach((element : any) =>{
        if(element.id_sistema == value.option.value){
          element.perfil = 0;
        }
      });
    }
  }

  optionPerfil(id_sistema : any, event : any){
    // console.log(id_sistema, event.value);
    this.sistemas_seleccionados.forEach((element : any) =>{
      if(element.id_sistema == id_sistema){
        element.id_perfil = event.value;
      }
    });
    
  }

  buscarEmpresa(){
    this.empresas_busqueda = [];
    this.empresas.forEach((element : any) => {
      this.empresas_busqueda.push({
        "empresa" : element.empresa,
        "id_empresa" : element.id_empresa,
        "activo" : element.activo
      });
    });
    if(this.busqueda.length > 0){
      this.empresas_busqueda = [];
      this.empresas.forEach((element : any) => {
        if(element.empresa.includes(this.busqueda.toUpperCase())){ 
          this.empresas_busqueda.push({
            "empresa" : element.empresa,
            "id_empresa" : element.id_empresa,
            "activo" : element.activo
          })
        }
      });
      // this.pintarEntidades(this.sistema_config);
    }
  }

  buscarCliente(){
    this.clientes_busqueda = [];
    this.clientes.forEach((element : any) => {
      this.clientes_busqueda.push({
        "cliente" : element.cliente,
        "id_cliente" : element.id_cliente,
        "activo" : element.activo
      });
    });
    if(this.busqueda.length > 0){
      this.clientes_busqueda = [];
      this.clientes.forEach((element : any) => {
        if(element.cliente.includes(this.busqueda.toUpperCase())){ 
          this.clientes_busqueda.push({
            "cliente" : element.cliente,
            "id_cliente" : element.id_cliente,
            "activo" : element.activo
          })
        }
      });
      // this.pintarEntidades(this.sistema_config);
    }
  }

  setEmpresa(event : any){
    if(event.option.selected){
      this.empresas_seleccionadas.push(event.option.value);
    }else{
      this.empresas_seleccionadas.forEach((element : any, index : any) => {
        if(element == event.option.value){
          this.empresas_seleccionadas.splice(index,1);
        }
      });
    }
  }

  setCliente(event : any){
    if(event.option.selected){
      this.clientes_seleccionados.push(event.option.value);
    }else{
      this.clientes_seleccionados.forEach((element : any, index : any) => {
        if(element == event.option.value){
          this.clientes_seleccionados.splice(index,1);
        }
      });
    }
  }

  pintarEntidades(tipo : any, arreglo : any){
    if(tipo == 1){
      arreglo.forEach((object : any) => {
        this.sistemas.forEach((sistema : any) => {
          if(object.id_sistema == sistema.id_sistema){
            sistema.activo = true;
            sistema.perfil = object.id_perfil;
          }
        });
      });
    }
    if(tipo == 2){
      arreglo.forEach((object : any) => {
        this.empresas_busqueda.forEach((empresa : any) => {
          if(object == empresa.id_empresa){
            empresa.activo = true;
          }
        });
      });
    }
    if(tipo == 3){
      arreglo.forEach((object : any) => {
        this.clientes_busqueda.forEach((cliente : any) => {
          if(object == cliente.id_cliente){
            cliente.activo = true;
          }
        });
      });
    }
  }

  editar(folio : any){
    this.sistemas = [];
    this.usuario_service.obtenerSistemas()
    .subscribe( (object : any) =>{
      if(object.ok){
        this.tipo_modal = 2;
        this.sistemas = object.data;
        this.openModal(1);
        this.usuario_service.obtenerUsuarioPorId(folio)
        .subscribe( (object : any) => {
          if(object.ok){
            this.texto_modal = "Editar usuario";
            //Se pinta la imagen
            this.fotografia.id_fotografia = object.data[0].id_fotografia;
            this.docB64 = object.data[0].fotografia;
            //Usuario
            this.usuario.usuario = object.data[0].usuario;
            this.usuario.password = object.data[0].password;
            this.usuario.nombre = object.data[0].nombre;
            this.usuario.id_usuario = object.data[0].id_usuario;
            this.sistemas_seleccionados = object.data[0].sistemas;
            this.pintarEntidades(1,object.data[0].sistemas);
            this.empresas_seleccionadas = object.data[0].empresas;
            this.pintarEntidades(2,object.data[0].empresas);
            this.clientes_seleccionados = object.data[0].clientes;
            this.pintarEntidades(3,object.data[0].clientes);
          }else{
            Swal.fire("Ha ocurrido un error",object.message,"error");
          }
        });
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

  obtenerSistemas(){
    this.sistemas = [];
    this.usuario_service.obtenerSistemas()
    .subscribe( (object : any) =>{
      if(object.ok){
        this.sistemas = object.data;
      }
    });
  }

  limpiarCampos(){
    this.fotografia = new Fotografia(0,"","","");
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
    this.usuario = {
      id_usuario : 0,
      fotografia : this.fotografia,
      usuario : "",
      nombre : "",
      password : "",
      sistemas : [],
      empresas : [],
      clientes : [],
      usuario_creacion : parseInt(""+this.usuario_creacion)
    };
    this.sistemas_seleccionados = [];
    this.empresas_seleccionadas = [];
    this.clientes_seleccionados = [];
  }

  openModal(tipo : any) {
    if(tipo == 1){
      this.limpiarCampos();
      this.mostrarEmpresas();
      this.mostrarClientes();
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
          this.usuario_service.altaUsuarioSuperAdmin(json)
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
