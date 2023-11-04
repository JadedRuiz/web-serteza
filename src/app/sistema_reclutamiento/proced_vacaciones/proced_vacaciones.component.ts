import { Component, ElementRef, QueryList, ViewChildren, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VacacionesService } from 'src/app/services/Reclutamiento/Vacaciones.service';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-proced-vacaciones',
  templateUrl: './proced_vacaciones.component.html',
  styleUrls: ['./proced_vacaciones.component.css']
})
export class ProcedVacacionesComponent implements OnInit {
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",0,this.direccion,this.fotografia);
  public candidatos : any;
  showModal = false;
  selectedRowData: any;
  modal: any;
  public status = -1; //Status default
  public palabra = "";
  filterControl = new FormControl();
  candidatos_busqueda : any;
  fotoVacaciones ='https://th.bing.com/th/id/R.5c02d8fdec86674d130b3a8f31fee1d4?rik=e%2fTs2ddf7yEj9g&pid=ImgRaw&r=0'

  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  filterControlEmpleados = new FormControl();
  objEmpleados: any;
    //Variables config
    public color = COLOR;
    public id_usuario = parseInt(window.sessionStorage.getItem("user")+"");
    public id_empleado = parseInt(window.sessionStorage.getItem("id_empleado")+"");
    bDisp = false;
    btnColor = "btn-info";
    objEmpleado = {
      empresa : 'SERTEZA',
      sucursal : 'ORIENTE',
      fecha_ing : '',
      depto : 'SISTEMAS',
      puesto : 'ING. EN SISTEMAS',
      vacaciones: {
        disp : 20,
        ejercicio : 2023,
        autorizados : 15,
        gozados : 12,
        saldo : 3
      }
    };
    objSolicitud = {
      fecha_ingreso : '',
      fecha_solcitud : '',
      fecha_inicio : '',
      fecha_fin : '',
      dias_total : 0,
      observaciones : ''
    };
    ejercicios = Array();
    @ViewChild("modal_vac",{static: false}) content : any;
    @ViewChild("modal_sol",{static: false}) content_two : any;
    arraySolicitudes = Array();
     // webcam snapshot trigger
     @ViewChild('content', { static: false }) modal_mov: any;
     @ViewChild('file_input', {read: ElementRef}) foto : any;
     @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
     @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

     fechaInicio = new FormControl(new Date());
     fechaFinal = new FormControl(new Date());
     serializedDate = new FormControl((new Date()).toISOString());
 private trigger: Subject<void> = new Subject<void>();
 private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
 @Output() getPicture = new EventEmitter<WebcamImage>();
 showWebcam = true;
 isCameraExist = true;
 errors: WebcamInitError[] = [];
public foto_user : any;
public docB64 = "";
public perfilStock : any = ''

  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private candidato_service: CandidatoService,
    private serv_vacaciones : VacacionesService) { }

  ngOnInit(): void {
    this.objEmpleados = [];
    this.getSolicitudes();
    this.getEjercicios();
  }

  buscarEmpleado() {
  }

  getSolicitudes() {
    // this.serv_vacaciones.obtenerUltimasSolicitudes(this.id_perfil, this.id_empleado)
    // .subscribe((resp : any) => {
    //   if(resp.ok){
    //     this.arraySolicitudes = resp.data;
    //   }
    // });
    this.arraySolicitudes = [1,2,3];
  }

openModal(){}

  getEjercicios(){
    let año = parseInt((new Date()).getFullYear()+"");
    for(let i=23; i>=0; i--){
      this.ejercicios.push(año);
      año--;
    }
    console.log(this.objEmpleado);
  }

  verDetalle(){
    this.bDisp = !this.bDisp;
    this.bDisp ? this.btnColor = "btn-danger" : this.btnColor = "btn-info";
  }

  vacacionesGozadas(){
    this.open(this.content);
  }

  nuevaSolicitud(){
    this.open(this.content_two);
    this.objSolicitud = {
      fecha_ingreso : '',
      fecha_solcitud : '',
      fecha_inicio : '',
      fecha_fin : '',
      dias_total : 0,
      observaciones : ''
    };
  }

  enviarSolicitud(){
    // this.serv_vacaciones.solicitarNueva(this.objSolicitud)
    // .subscribe((resp : any) => {
      // if(resp.ok){
        Swal.fire('Bien hecho','La solicitud se ha enviado a R.H','success');
        this.modalService.dismissAll('Close');
    //   }
    // })
  }

  open(content : any) {
    this.modalService.open(content,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }


// BARRA DE BUSQUEDA
mostrarCandidatos(){
  let json = {
    palabra : this.palabra.toUpperCase(),
    status : this.status,
    id_cliente : this.id_cliente,
    tipo : 1
  };
  this.candidatos = [];
  this.candidato_service.obtenerCandidatos(json)
  .subscribe( (object : any) =>{
      if(object.ok){
        // this.dataSource.data = object.data;
        // this.dataSource.paginator = this.paginator;
       this.candidatos_busqueda= object.data;
       this.objEmpleados = object.data
      }
  });
}

buscarCandidato(){
  this.palabra = this.filterControl.value;
  if(this.filterControl.value.length < 1){
    this.mostrarCandidatos();
  }
  if(this.filterControl.value.length > 2){
    this.autocomplete(this.filterControl.value);
  }
}

autocomplete(palabra : string){
 // this.candidatos_busqueda = [];
  if(palabra.length > 2){
    let json = {
      nombre_candidato : this.palabra.toUpperCase(),
      status : this.status,
      id_cliente : this.id_cliente
    };
    this.candidato_service.autoCompleteCandidato(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.objEmpleados = object.data;
        // this.dataSource.data = object.data;
        // n this.dataSource.paginator = this.paginator;
      }
    })
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
 public modal_camera : any;


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
         this.perfilStock = this.sanitizer.bypassSecurityTrustResourceUrl(img);
         this.fotoVacaciones = this.perfilStock;
         this.docB64 = respuesta+"";
         this.fotografia.docB64 = respuesta+"";
         this.fotografia.extension = extension;
         console.log('oio>',this.foto_user);
         this.togglePhotosModal()
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
 }

 openModalCamera(){
   this.modal_camera = this.modalService.open(this.contenidoDelModalCamera,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop', backdrop: 'static', keyboard: false});
   // this.showWebcam = true;
 }

 cerrarModalCamera(){
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
   this.fotoVacaciones = webcamImage.imageAsDataUrl;
   let docB64 = this.foto_user.split(",");
   this.fotografia.docB64 = docB64[1];
   this.fotografia.extension = "jpeg";
   this.fotografia.nombre = "foto_user";
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


//  MODAL EDITAR
editar = false;
modalEditar(){
  this.editar = true;
    this.modal = this.modalService.open(this.modal_mov,{
       size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
}


}
