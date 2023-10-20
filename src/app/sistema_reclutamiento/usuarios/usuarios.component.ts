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



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");

  public perfilStock =
    'https://th.bing.com/th/id/R.20836a4a6bf6d8ee3031d28e133a9eb7?rik=gG%2bcRJRZ4jd0Cw&riu=http%3a%2f%2fconstantcontinuity.com%2fconstantcontinuity%2fimages%2fbig1.png&ehk=TtGb2WLFcbckjNT98147tFsMNaunQxrZpJ2JeMw0i84%3d&risl=&pid=ImgRaw&r=0';
  public color = COLOR;
  filterControl = new FormControl();

  datastorage: any = JSON.parse(localStorage.getItem('dataPage')!);
  miComprador = 1;
  miToken = 'VzNobUpiVm03SityMXRyN3ZROGEyaU0wWXVnYXowRjlkQzMxN0s2NjRDcz0=';
  miPerfil = 'ADMINISTRADOR';
  miUsuario = 1;
  camposActivos = false; //Sólo se utiliza actualmente para el botón de añadir foto de usuario por alguna razón
  status: boolean = false;
  usuarios_busqueda : any;
  usuarios : any;
  formUsuario = false;
   // webcam snapshot trigger
   private trigger: Subject<void> = new Subject<void>();
   private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
   @Output() getPicture = new EventEmitter<WebcamImage>();
   showWebcam = true;
   isCameraExist = true;
   errors: WebcamInitError[] = [];
  public fotografia = new Fotografia(0,"","","");
  public foto_user : any;
  public docB64 = "";
  @ViewChild('file_input', {read: ElementRef}) foto : any;

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
    ''
  );

  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;


    constructor(private usuarioService: UsuarioService,
      private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.consultarPerfiles();
    this.mostrarUsuarios();
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    });
  }

  // Obtener USUARIOS
  obtenerUsuarios() {
    let json = {
      id_usuario: 0,
      id_cliente: 5,
      id_sistema: 2,
      usuario: '',
      solo_activos: 1,
      id_usuario_consulta: 0,
      token: '012354SDSDS01',
    };
    this.usuarioService.consultarUsuarios(json).subscribe((resp) => {
      if (resp.ok) {
        console.log('Usuarios :>> ', resp.data);
      }
    });
  }

  // Guardar Usuario
  guardarUsuario() {
    let json = {
      id_usuario: 0,
      id_cliente: 5,
      id_sistema: 2,
      id_candidato: 0,
      token: '012354SDSDS01',
      nombre: this.nuevoUsuario.nombre,
      usuario: this.nuevoUsuario.usuario,
      password: this.nuevoUsuario.password,
      id_perfil: this.nuevoUsuario.id_perfil,
      activo: 1,
      id_usuario_guardar: 1,
      id_fotografia: 0,
      extencion: '',
      foto_base64: '',
    };
    console.log('jsonGuardar :>> ', json);
    this.usuarioService.guardarUsuario(json).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire(
          'Exito',
          resp.data.mensaje,
          'success'
        )
        // console.log('resp.mensaje :>> ', resp.data.mensaje);
      }
    });
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
      ''
    );
    this.formUsuario= false;
  }

  // Activar/Desactivar Usuario =>
  activarUsuario() {
    let json ={
      id_usuario: 0,
      token: 'token',
      id_usuario_modif: 1
    }
    this.usuarioService.activarUsuario(json).subscribe((resp) => {
      if(resp.ok){

      }
    })
  }

  agregarUsuario(){
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
      ''
    );
    this.formUsuario= true;

  }


  // Obtener PERFILES
  perfiles: Perfil[] = [];

consultarPerfiles(){
  let json = {
    id_perfil: 0,
    id_sistema: 2,
    perfil: "",
    solo_activos: 1,
    token: "012354SDSDS01"
  }
  this.usuarioService.consultarPerfiles(json).subscribe((resp)=>{
    if(resp.ok){
      this.perfiles = resp.data;
      console.log('Perfiles :>> ', resp.data);
    }
  })
}




// BARRA DE BUSQUEDA
mostrarUsuarios(){
  let json = {
    id_usuario: 0,
    id_cliente: 5,
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
    }
  });

}

buscarUsuario(){
  if(this.filterControl.value.length > 1){
  this.usuarios_busqueda = [];
  this.usuarios.forEach((element : any) => {
    this.usuarios_busqueda.push({
      "nombre" : element.nombre,
      "id_usuario" : element.id_usuario
    });
  });
}
  if(this.filterControl.value.length > 2){
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
  console.log(value.option.id);
  this.nuevoUsuario = value.option.id;
  this.formUsuario= true;

}







  //MODAL PARA AÑADIR FOTOS AL USUARIO
  extraModal: boolean = false;
  ubicacionVendedor: any;
  imageCount: number = 0;
  imageAfterResize: any;
  mainImage: string = '';
  takingPhoto: boolean = false;
  public triggerObservable: Observable<void> = this.trigger.asObservable();


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





  //FUNCIÓN PARA ABRIR MODAL PARA AÑADIR FOTOS AL CLIENTE
  togglePhotosModal() {
    this.extraModal = !this.extraModal;
    this.takingPhoto = false;
    console.log(this.extraModal);
  }

  //Función para subir fotografía desde el dispositivo
  async uploadImage() {
    //  return this.imageCompress
    //     .uploadFile()
    //     .then(({ image, orientation }: UploadResponse) => {
    //        console.log(image);
    //        if (this.imageCompress.byteCount(image) > 5 * 1024 * 1024) {
    //           alert('El tamaño de la imagen excede el límite de 5 MB');
    //           return;
    //        }
    //        this.imageCompress
    //           .compressFile(image, orientation, 40, 40, 400, 400)
    //           .then((result: DataUrl) => {
    //              this.mainImage = result
    //              this.usuario.foto_base64 = result.slice(22);
    //              this.usuario.extencion = 'jpeg';
    //              console.log(this.usuario.foto_base64);
    //           });
    //     });
  }

  //Función para abrir la cámara
  openWebcam() {
    this.takingPhoto = true;
  }

  //Función para cerrar la cámara
  closeWebcam() {
    this.takingPhoto = false;
  }

  //Función para tomar la fotografía
  capturePhoto() {
    this.trigger.next();
  }


}
