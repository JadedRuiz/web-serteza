import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR, SERVER_API } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { filter } from 'rxjs/operators';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { DateAdapter } from '@angular/material/core';
  
@Component({
  selector: 'app-candidatos-original',
  templateUrl: './cat_candidatos.component.html',
  styleUrls: ['./cat_candidatos.component.css']
})
export class CatalogoCandidatosComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
  public info_contrato : any;
  public candidatos : any;
  public band = true;
  public modal : any;
  public estatus_color = "";
  public modal_camera : any;
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
  public activo = true;
  public foto_user : any;
  public docB64 = "";
  public bandera_activo = false;
  public band_persiana = true;
  //Modelo tabla
  displayedColumns: string[] = ['id_candidato', 'fotografia', "candidato", "descripcion", 'estatus', 'accion'];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  //Buscador
  filterControl = new FormControl();
  candidatos_busqueda : any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  //Filtros
  public status = -1; //Status default
  public palabra = "";
  //Autocomplete
  myControl = new FormControl();
  tipo_modal = 0;

  colonias = [
    "Primero ingresa el Codigo Postal"
  ];

  @ViewChild('file_input', {read: ElementRef}) foto : any;

  constructor( 
    public cp_service: LocalidadService,
    private candidato_service: CandidatoService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
    this.modal_camera = NgbModalRef;
    this.modal = NgbModalRef;
    this.paginator = MatPaginator;
    this.candidatos_busqueda = [];
    this.dateAdapter.setLocale('en-GB');
   }

  ngOnInit(): void {
    this.mostrarCandidatos();
    this.mostrarEstado();
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    });
  }

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
          this.dataSource.data = object.data;
          this.dataSource.paginator = this.paginator;
          this.candidatos_busqueda= object.data;
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
    this.candidatos_busqueda = [];
    if(palabra.length > 2){
      let json = {
        nombre_candidato : this.palabra.toUpperCase(),
        status : this.status,
        id_cliente : this.id_cliente
      };
      this.candidato_service.autoCompleteCandidato(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.dataSource.data = object.data;
          this.dataSource.paginator = this.paginator;
        }
      })
    }
  }

  mostrarEstado(){
    this.estados_busqueda = [];
    this.estados = [];
    this.compartido_service.obtenerCatalogo("gen_cat_estados")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.estados_busqueda = object;
        this.estados = object;
      }
    });
  }

  buscarEstado(){
    this.estados_busqueda = [];
    this.estados.forEach((element : any) => {
      this.estados_busqueda.push({
        "estado" : element.estado,
        "id_estado" : element.id_estado
      });
    });
    if(this.filterControlEstado.value.length > 0){
      this.estados_busqueda = [];
      this.estados.forEach((element : any) => {
        if(element.estado.includes(this.filterControlEstado.value.toUpperCase())){ 
          this.estados_busqueda.push({
            "estado" : element.estado,
            "id_estado" : element.id_estado
          })
        }
      });
    }
  }

  optionEstado(value : any){
    this.candidato.direccion.estado = value.option.id;
  }

  altaCandidato(){
    let band = true;
    if(this.candidato.apellido_paterno == "" || this.candidato.apellido_materno == "" || this.candidato.nombre == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == "" && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar una empresa sin ninguna dato de dirección?',
            text: "El empresa se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'info',
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
              title: '¿Estas seguro de agregar al candidato sin ningun foto?',
              text: "El candidato se registrará sin foto, pero puedes actulizar su información en cualquier momento",
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, estoy seguro',
              cancelButtonText : "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                this.confirmar("Confirmación","¿Seguro que desea guardar la información?","info",1);
              }else{
                band = false;
              }
            });
          }else{
            if(band){
              this.confirmar("Confirmación","¿Seguro que desea guardar la información?","info",1);
            }
          }
        }
      }
    }
  }

  mostrarInfoContrato(id_candidato : any){
    this.candidato_service.obtenerMovientosCandidato(id_candidato)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.info_contrato = object.data;
      }
    });
  }

  editar(folio : any){
    this.mostrarInfoContrato(folio);
    this.candidato_service.obtenerCandidatoPorId(folio)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.tipo_modal = 2;
        this.openModal();
        if(object.data[0].id_status == 1){
          this.bandera_activo = true;
        }
        //Datos de direccion
        this.candidato.direccion.id_direccion = object.data[0].id_direccion;
        this.candidato.direccion.calle = object.data[0].calle;
        this.candidato.direccion.numero_exterior = object.data[0].numero_exterior;
        this.candidato.direccion.numero_interior = object.data[0].numero_interior;
        this.candidato.direccion.cruzamiento_uno = object.data[0].cruzamiento_uno;
        this.candidato.direccion.cruzamiento_dos = object.data[0].cruzamiento_dos;
        this.candidato.direccion.codigo_postal = object.data[0].codigo_postal;
        this.candidato.direccion.colonia = object.data[0].colonia;
        this.candidato.direccion.localidad = object.data[0].localidad;
        this.candidato.direccion.municipio = object.data[0].municipio;
        
        this.filterControlEstado.setValue(object.data[0].estado);
        this.candidato.direccion.estado = object.data[0].id_estado;
        this.candidato.direccion.descripcion = object.data[0].descripcion_direccion;
        //Datos de usuario
        this.candidato.id_candidato = object.data[0].id_candidato;
        this.candidato.apellido_paterno = object.data[0].apellido_paterno;
        this.candidato.apellido_materno = object.data[0].apellido_materno;
        
        this.candidato.id_statu = object.data[0].id_status;
        this.candidato.nombre = object.data[0].nombre;
        this.candidato.rfc = object.data[0].rfc;
        this.candidato.curp = object.data[0].curp;
        this.candidato.fecha_nacimiento = object.data[0].fecha_nacimiento;
        this.candidato.lugar_nacimiento = object.data[0].lugar_nacimiento;
        this.candidato.numero_social = object.data[0].numero_seguro;
        this.candidato.descripcion = object.data[0].descripcion;
        this.candidato.edad = object.data[0].edad;
        this.candidato.correo = object.data[0].correo;
        this.candidato.telefono = object.data[0].telefono;
        this.candidato.telefono_dos = object.data[0].telefono_dos;
        this.candidato.telefono_tres = object.data[0].telefono_tres;
        this.candidato.fotografia.id_fotografia = object.data[0].id_fotografia;
        //Poner imagen
        this.foto_user = ""+object.data[0].fotografia;

      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }

  modificarCandidato(){
    let band = true;
    if(this.candidato.apellido_paterno == "" || this.candidato.apellido_materno == "" || this.candidato.nombre == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == "" && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar un candidato sin ninguna dato de dirección?',
            text: "El candidato se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'info',
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
              title: '¿Estas seguro de agregar al candidato sin ningun foto?',
              text: "El candidato se registrará sin foto, pero puedes actulizar su información en cualquier momento",
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, estoy seguro',
              cancelButtonText : "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                this.confirmar("Confirmación","¿Seguro que desea editar la información?","info",2);
              }else{
                band = false;
              }
            });
          }else{
            if(band){
              this.confirmar("Confirmación","¿Seguro que desea editar la información?","info",2);
            }
          }
        }
      }
    }
  }

  limpiarCampos(){
    this.direccion  = new Direccion(0,"","","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","",""); 
    this.candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
  }

  generarEdad(){
    let convertAge = new Date(this.candidato.fecha_nacimiento+"");
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    this.candidato.edad = edad;
  }
  getDatos(){
    this.cp_service.getDirrecion(this.candidato.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.candidato.direccion.estado = data[0].response.estado;
        this.candidato.direccion.municipio = data[0].response.municipio;
        this.colonias = [];
        for(let i=0;i<data.length;i++){
          this.colonias.push(data[i].response.asentamiento);
        }
      }
    },
    (error : any) => {
      swal.fire('Ha ocurrido un error','No se han encontrado resultados', 'warning');
    });
  }

  accionContenedorGuardar(band : any){
    let contenedor_actualizar = document.getElementById("guardar");
    if(band == true){
      contenedor_actualizar?.setAttribute("style","display:inline;");
    }else{
      contenedor_actualizar?.setAttribute("style","display:none;");
    }
  }

  cambiarEstatus(estatus : any){
    this.status = estatus;
    if(estatus == "En reclutamiento"){
      this.estatus_color = "bg-success";
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
  
  openModal() {
    this.bandera_activo = false;
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop', backdrop: 'static', keyboard: false});
  }

  cerrarModal(){
    this.modal.close();
  }

  guardar(){
    this.limpiarCampos();
    this.tipo_modal = 1;
    this.openModal();
  }

  optionCandidato(event : any) {
    this.editar(event.option.id);
    this.candidatos_busqueda.splice(0,this.candidatos_busqueda.length);
    this.myControl.reset('');
  }

  busqueda(value : string){
    if(value.length > 3){
      this.autocomplete(value);
    }
  }

  modificarMunicipio(){
    let colonia = this.candidato.direccion.colonia;
    this.cp_service.getDirrecion(this.candidato.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.candidato.direccion.estado = data[i].response.estado;
            this.candidato.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }

  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
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
    let docB64 = this.foto_user.split(",");
    this.fotografia.docB64 = docB64[1];
    this.fotografia.extension = "jpeg";
    this.fotografia.nombre = "foto_user";
    this.cerrarModalCamera();
    // console.log(webcamImage.imageAsDataUrl)
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){
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
          this.candidato_service.altaCandidato(this.candidato)
          .subscribe( (object) =>{
            if(object.ok){
              this.limpiarCampos();
              this.mostrarCandidatos();
              Swal.fire("Buen trabajo","La empresa se ha dado de alta correctamente","success");
              this.cerrarModal();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.candidato_service.actualizarCandidato(this.candidato)
          .subscribe( (object) =>{
            if(object.ok){
              this.mostrarCandidatos();
              Swal.fire("Buen trabajo","La empresa se ha modificado correctamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
  descargarContrato(id : any){
    location.href = SERVER_API+"contratacion/obtenerDocContratacionPorCandidato/"+id;

  }
}

