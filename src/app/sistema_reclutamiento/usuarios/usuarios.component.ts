import { Component, ElementRef, QueryList, ViewChildren, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable, Subject, Subscription, } from 'rxjs';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { NuevoUsuario } from 'src/app/models/NuevoUsuario';
import { Perfil } from 'src/app/models/Perfil';
import { DomSanitizer } from '@angular/platform-browser';
import { Fotografia } from 'src/app/models/Fotografia';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  public usuario_logueado = parseInt(
    window.sessionStorage.getItem('user') + ''
  );
  public id_cliente = parseInt(window.sessionStorage.getItem('cliente') + '');
  // public token = parseInt(window.sessionStorage.getItem("token")+"");
  public token = 'token';

  public perfilStock: any =
    'https://th.bing.com/th/id/R.20836a4a6bf6d8ee3031d28e133a9eb7?rik=gG%2bcRJRZ4jd0Cw&riu=http%3a%2f%2fconstantcontinuity.com%2fconstantcontinuity%2fimages%2fbig1.png&ehk=TtGb2WLFcbckjNT98147tFsMNaunQxrZpJ2JeMw0i84%3d&risl=&pid=ImgRaw&r=0';
  public color = COLOR;
  // BUSCAR CANDIDATOS
  public status = -1;
  filterControlEmpleados = new FormControl();
  filterControl = new FormControl();
  candidatos: any;
  candidatos_busqueda: any;
  objEmpleados: any;
  idCandi: any;
  palabra = '';
  // <=
  datastorage: any = JSON.parse(localStorage.getItem('dataPage')!);
  miComprador = 1;
  miToken = 'VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0=';
  miPerfil = 'ADMINISTRADOR';
  miUsuario = 1;
  camposActivos = false; //Sólo se utiliza actualmente para el botón de añadir foto de usuario por alguna razón
  // status: boolean = false;
  usuarios_busqueda: any;
  usuarios: any;
  formUsuario = false;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  public fotografia = new Fotografia(0, '', '', '');
  public foto_user: any;
  public docB64 = '';
  hide = true;
  nomAsi = false;
  pass = false;
  isEditMode = false;
  ocultar = false;
  @ViewChild('file_input', { read: ElementRef }) foto: any;
  @ViewChild('modal_camera', { static: false }) contenidoDelModalCamera: any;
  nuevoUsuario = new NuevoUsuario(
    0,
    0,
    0,
    0,
    '',
    '',
    '',
    '',
    0,
    0,
    0,
    0,
    '',
    '',
    '',
    ''
  );

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;
  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
      ) {

      }

  ngOnInit(): void {
    this.consultarPerfiles();
    this.mostrarUsuarios();
    this.mostrarCandidatos();
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    );


  }




  // BARRA DE BUSQUEDA CANDIDATOS
  mostrarCandidatos() {
    let json = {
      palabra: this.palabra.toUpperCase(),
      status: this.status,
      id_cliente: this.id_cliente,
      tipo: 1,
    };
    this.candidatos = [];
    this.candidato_service.obtenerCandidatos(json).subscribe((object: any) => {
      if (object.ok) {
        this.candidatos_busqueda = object.data;
        this.objEmpleados = object.data;
      }
    });
  }
  buscarCandidato() {
    this.palabra = this.filterControl.value;
    if (this.filterControl.value.length < 1) {
      this.mostrarCandidatos();
    }
    if (this.filterControl.value.length > 2) {
      this.autocomplete(this.filterControl.value);
    }
  }
  autocomplete(palabra: string) {
    this.objEmpleados = [];
    if (palabra.length > 2) {
      let json = {
        nombre_candidato: this.palabra.toUpperCase(),
        status: this.status,
        id_cliente: this.id_cliente,
      };
      this.candidato_service
        .autoCompleteCandidato(json)
        .subscribe((object: any) => {
          if (object.ok) {
            this.objEmpleados = object.data;
            //  this.candidatos_busqueda = object.data;
            //  this.idCandi = this.objEmpleados[0].id_candidato
          }
        });
    }
  }

  // Obtener PERFILES
  perfiles: Perfil[] = [];

  consultarPerfiles() {
    let json = {
      id_perfil: 0,
      id_sistema: 2,
      perfil: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.usuarioService.consultarPerfiles(json).subscribe((resp) => {
      if (resp.ok) {
        this.perfiles = resp.data;
        console.log('Perfiles :>> ', resp.data);
      }
    });
  }

  // BARRA DE BUSQUEDA USUARIOS
  mostrarUsuarios() {
    let json = {
      id_usuario: 0,
      id_cliente: this.id_cliente,
      id_sistema: 2,
      usuario: '',
      solo_activos: 1,
      id_usuario_consulta: 0,
      token: '012354SDSDS01',
    };
    this.usuarioService.consultarUsuarios(json).subscribe((resp) => {
      if (resp.ok) {
        console.log('Usuarios :>> ', resp.data);
        this.usuarios = resp.data;
         this.usuarios_busqueda = resp.data;
        // this.usuarios_busqueda = resp.data.map((usuario:any) => usuario.nombre);
      }
    });
  }

  buscarUsuario() {
    const searchTerm = this.filterControl.value.toUpperCase();
    this.usuarios_busqueda = [];
    // console.log(this.filterControl.value)

    if (searchTerm.length >= 2) {
      // console.log(this.usuarios)

      this.usuarios.forEach((element: any) => {
        if (element.nombre.toUpperCase().includes(searchTerm)) {
          this.usuarios_busqueda.push({
            id_usuario: element.id_usuario,
            id_cliente: element.id_cliente,
            id_perfil: element.id_perfil,
            usuario: element.usuario,
            nombre: element.nombre,
            password: element.password,
            fotografia: element.fotografia,
            id_fotografia: element.id_fotografia,
            nombre_completo: element.nombre_completo,
            id_candidato: element.id_candidato,
          });
        }
      });
      console.log(this.usuarios)
      console.log(this.usuarios_busqueda)
    }
  }



  fotoUsuario: any = '';
  json: any = '';
  optionUsuario(value: any) {
    console.log(value.option.id);
    this.ocultar = true;
    this.isEditMode = true;
    this.vaciarModelo();
    this.nuevoUsuario = value.option.id;
    this.formUsuario = true;
    if (this.nuevoUsuario.id_fotografia == 0 ) {
      console.log('entro');
      this.perfilStock =
        'https://th.bing.com/th/id/R.20836a4a6bf6d8ee3031d28e133a9eb7?rik=gG%2bcRJRZ4jd0Cw&riu=http%3a%2f%2fconstantcontinuity.com%2fconstantcontinuity%2fimages%2fbig1.png&ehk=TtGb2WLFcbckjNT98147tFsMNaunQxrZpJ2JeMw0i84%3d&risl=&pid=ImgRaw&r=0';
    } else {
      this.perfilStock= this.nuevoUsuario.fotografia
    }
  }


  optionUsuario2(value: any) {
    this.nuevoUsuario = value.option.id;
    this.nuevoUsuario.id_candidato = this.nuevoUsuario.id_candidato;
    // console.log('<',value.option.id);
  }

  // Guardar Usuario
  ediFoto = false;
  guardarUsuario() {
    if (this.isEditMode) {
      console.log('editado? >> ');
      let json = {
        id_usuario: this.nuevoUsuario.id_usuario,
        id_cliente: this.id_cliente,
        id_sistema: 2,
        id_candidato: this.nuevoUsuario.id_candidato,
        token: this.token,
        nombre: this.nuevoUsuario.nombre,
        usuario: this.nuevoUsuario.usuario,
        password: this.nuevoUsuario.password,
        id_perfil: this.nuevoUsuario.id_perfil,
        activo: 1,
        id_usuario_guardar: 1,
        id_fotografia: 0,
        extencion: this.fotografia.extension,
        foto_base64: this.fotografia.docB64,
      };
      Swal.fire({
        title: "¿Desea guardar los cambios",
        showCancelButton: true,
        confirmButtonText: "Guardar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.guardarUsuario(json).subscribe((resp) => {
            if (resp.ok) {
              Swal.fire('Exito', resp.data.mensaje, 'success');
              this.cancelar();
              this.vaciarModelo();
              this.mostrarUsuarios();
            } else {
              Swal.fire('', resp.message, 'info');
            }
          });
        }
            });

       console.log('jsonEditar:>> ', json);
    } else {
      console.log('nuevo? >> ');
      let json = {
        id_usuario: 0,
        id_cliente: this.id_cliente,
        id_sistema: 2,
        id_candidato: this.nuevoUsuario.id_candidato,
        token: this.token,
        nombre: this.nuevoUsuario.nombre,
        usuario: this.nuevoUsuario.usuario,
        password: this.nuevoUsuario.password,
        id_perfil: this.nuevoUsuario.id_perfil,
        activo: 1,
        id_usuario_guardar: 1,
        id_fotografia: 0,
        extencion: this.fotografia.extension,
        foto_base64: this.fotografia.docB64,
      };
      Swal.fire({
        title: "¿Crear nuevo usuario?",
        showCancelButton: true,
        confirmButtonText: "Guardar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.guardarUsuario(json).subscribe((resp) => {
            if (resp.ok) {
              Swal.fire('Exito', resp.data.mensaje, 'success');
              this.cancelar();
              this.vaciarModelo();
              this.mostrarUsuarios();
            } else {
              Swal.fire('', resp.message, 'info');
            }
          });
        }
            });
         console.log('resp:>> ', json);
    }

  }

   // Activar/Desactivar Usuario =>
  activarUsuario() {
    let json = {
      id_usuario: 0,
      token: 'token',
      id_usuario_modif: 1,
    };
    this.usuarioService.activarUsuario(json).subscribe((resp) => {
      if (resp.ok) {
      }
    });
  }

  agregarUsuario() {
    this.filterControl = new FormControl();
    this.perfilStock =
      'https://th.bing.com/th/id/R.20836a4a6bf6d8ee3031d28e133a9eb7?rik=gG%2bcRJRZ4jd0Cw&riu=http%3a%2f%2fconstantcontinuity.com%2fconstantcontinuity%2fimages%2fbig1.png&ehk=TtGb2WLFcbckjNT98147tFsMNaunQxrZpJ2JeMw0i84%3d&risl=&pid=ImgRaw&r=0';
    this.vaciarModelo();
    this.objEmpleados = [];
    this.formUsuario = true;
    this.ocultar = true;
    this.isEditMode = false;
  }

  cancelar() {
    this.formUsuario = false;
    this.ocultar = false;
    this.filterControl = new FormControl();
    this.vaciarModelo();
  }

  // EDITAR NOMBRE
  editarnombre() {
    this.nomAsi = false;
  }

  Edit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Restaura los valores originales del formulario si se cancela la edición.
      // Por ejemplo, puedes cargar los valores desde tu modelo de datos nuevamente.
    }
  }

  //MODAL PARA AÑADIR FOTOS AL USUARIO
  extraModal: boolean = false;
  ubicacionVendedor: any;
  imageCount: number = 0;
  imageAfterResize: any;
  mainImage: string = '';
  takingPhoto: boolean = false;
  // public triggerObservable: Observable<void> = this.trigger.asObservable();
  public modal_camera: any;

  subirImagen() {
    document.getElementById('foto_user')?.click();
  }

  convertirImagenAB64(fileInput: any) {
    return new Promise(function (resolve, reject) {
      let b64 = '';
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
        b64 = e.target.result.split('base64,')[1];
        resolve(b64);
      };
    });
  }

  cambiarImagen(event: any) {
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split('.')[1];
      this.fotografia.extension = extension;
      if (extension == 'jpg' || extension == 'png') {
        this.convertirImagenAB64(archivos).then((respuesta) => {
          let img = 'data:image/' + extension + ';base64, ' + respuesta;
          this.perfilStock = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta + '';
          this.fotografia.docB64 = respuesta + '';
          this.fotografia.extension = extension;
          this.togglePhotosModal();
        });
      } else {
        Swal.fire(
          'Ha ocurrido un error',
          'Tipo de imagen no permitida',
          'error'
        );
      }
    }

  }

  //FUNCIÓN PARA ABRIR MODAL PARA AÑADIR FOTOS AL CLIENTE
  togglePhotosModal() {
    this.extraModal = !this.extraModal;
    this.takingPhoto = false;
    console.log(this.extraModal);
  }

  openModalCamera() {
    this.modal_camera = this.modalService.open(this.contenidoDelModalCamera, {
      size: 'md',
      centered: true,
      backdropClass: 'light-blue-backdrop',
      backdrop: 'static',
      keyboard: false,
    });
    // this.showWebcam = true;
  }

  cerrarModalCamera() {
    this.modal_camera.close();
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
    this.foto_user = webcamImage.imageAsDataUrl;
    this.perfilStock = webcamImage.imageAsDataUrl;
    let docB64 = this.foto_user.split(',');
    this.fotografia.docB64 = docB64[1];
    this.fotografia.extension = 'jpeg';
    this.fotografia.nombre = 'foto_user';
    this.cerrarModalCamera();
    this.togglePhotosModal();
    // console.log(webcamImage.imageAsDataUrl)
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  // VACIAR MODELO
  vaciarModelo() {
    this.nuevoUsuario = new NuevoUsuario(
      0,
      0,
      0,
      0,
      '',
      '',
      '',
      '',
      0,
      0,
      0,
      0,
      '',
      '',
      ''
    );
  }
}
