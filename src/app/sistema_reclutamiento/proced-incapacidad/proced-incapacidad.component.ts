import { Component, ElementRef, QueryList, ViewChildren, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { COLOR } from 'src/config/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncapacidadService } from 'src/app/services/incapacidades/incapacidad.service';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Incapacidad } from 'src/app/models/incapacidad';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-proced-incapacidad',
  templateUrl: './proced-incapacidad.component.html',
  styleUrls: ['./proced-incapacidad.component.css'],
})
export class ProcedIncapacidadComponent implements OnInit {
fotoIncapacidad ='https://th.bing.com/th/id/R.218d63aed1c5e714180a6b190913fb4f?rik=OiNmcrpCohbNsQ&pid=ImgRaw&r=0&sres=1&sresct=1'
public perfilStock : any = ''
public direccion: Direccion = new Direccion(
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  public fotografia = new Fotografia(0, '', '', '');
  public id_cliente = parseInt(window.sessionStorage.getItem('cliente') + '');
  public candidato = new Candidato(
    0,
    this.id_cliente,
    6,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    0,
    this.direccion,
    this.fotografia
  );
  incapacidad = new Incapacidad(0,0,0,'',0,'','',0,'',0)
  public candidatos: any;
  public color = COLOR;
  public status = -1; //Status default
  public palabra = '';
  filterControl = new FormControl();
  public candidatos_busqueda: any ;
  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  filterControlEmpleados = new FormControl();
  objEmpleados: any;
  // VARIABLES TABLA
  displayedColumns: string[] = [
    'fecha',
    'entrada',
    'salida',
    'tipoF',
    'tipoD',
    'tipoV',
    'tipoR',
    'descripcion',
  ];
  // incapacidades = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('content', { static: false }) modal_mov: any;
  @ViewChild('file_input', {read: ElementRef}) foto : any;
  @ViewChild('modal_camera', {static: false}) contenidoDelModalCamera : any;
  @ViewChildren('inputProvForm') provInputs!: QueryList<ElementRef>;

  fechaInicio = new FormControl(new Date());
  fechaFinal = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  showModal = false;
  selectedRowData: any;
  modal: any;
incapacidades:any=''
// PARA FOTO DE COMPROBANTE
 // webcam snapshot trigger
 private trigger: Subject<void> = new Subject<void>();
 private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
 @Output() getPicture = new EventEmitter<WebcamImage>();
 showWebcam = true;
 isCameraExist = true;
 errors: WebcamInitError[] = [];
public foto_user : any;
public docB64 = "";
  constructor(
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,

    private candidato_service: CandidatoService,
    private incapacidadService: IncapacidadService
  ) {
    // Genera datos de prueba
    this.objEmpleados = '';
    // this.dataSource = '';
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    });
     this.obternerIncapacidades();

  }

  private generateTableData(): any[] {
    const tableData = [];
    for (let i = 1; i <= 3; i++) {
      tableData.push({
        fecha: `2023-10-${i}`,
        entrada: `Entrada ${i}`,
        salida: `Salida ${i}`,
        tipoF: 'A',
        tipoD: 'M',
        tipoV: 'B',
        tipoR: 'A',
        descripcion: `Descripción ${i}`,
      });
    }
    return tableData;
  }

  // MODAL
  editar = false;
  openModal(rowData: any) {
    this.editar = true;
    this.vaciarModelo();
    this.modal = this.modalService.open(this.modal_mov, {
      size: 'lg',
      centered: true,
    });
    this.selectedRowData = rowData;
    this.incapacidad = rowData;
    console.log(this.incapacidad);
  }

  closeModal() {
    this.modal.close();
  }

  // BARRA DE BUSQUEDA
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
    //  this.candidatos_busqueda = [];
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
            this.candidatos_busqueda = object.data;
          }
        });
    }
  }

  // INCAPACIDADES

  // OBTENER
  usuarioSeleccionado= {
    'id_candidato' :''
  }
  optionUsuario(value : any){
    this.usuarioSeleccionado = value.option.id;
    console.log(this.usuarioSeleccionado);
    console.log(this.usuarioSeleccionado.id_candidato);
    this.obternerIncapacidades()
  }

  obternerIncapacidades() {
    let json = {
      id_incapacidad: 0,
      id_cliente: this.id_cliente,
      id_candidato: 0 || this.usuarioSeleccionado.id_candidato,
      fecha_incial: '',
      fecha_final: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.incapacidadService.obternerIncapacidades(json).subscribe((resp) => {
      if (resp.ok) {
        // Swal.fire('Exito', resp.message, 'success');
        this.incapacidades = resp.data
      }
    });
  }

  inca = {
    fecha_inicial: '',
    fecha_final: '',
    dias: ''
  };

// MOSTRAR DIAS INCAPACIDAD|
calcularFechaFinal() {
  console.log('entro :>> ');
  if (this.inca.fecha_inicial && this.inca.dias) {
    const fechaInicial = new Date(this.inca.fecha_inicial);
    const dias = parseInt(this.inca.dias, 10);
    const fechaFinal = new Date(fechaInicial);
    fechaFinal.setDate(fechaFinal.getDate() + dias);
    this.incapacidad.fecha_final = fechaFinal;
  }
}


  // GUARDAR

  // FORMATEAR
  formatearFechaParaGuardar(fecha: any) {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-US');
  }

  // CALCULAR

  calcularDiasIncapacidad() {
    const fechaInicial = new Date(this.incapacidad.fecha_inicial);
    const fechaFinal = new Date(this.incapacidad.fecha_final);

    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaMilisegundos = fechaFinal.getTime() - fechaInicial.getTime();

    // Convierte la diferencia en milisegundos a días
    const diasIncapacidad = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    return diasIncapacidad;
  }

  // GUARDAR
  guardarIncapacidad() {
    const fechaInicialFormateada = this.formatearFechaParaGuardar(this.incapacidad.fecha_inicial);
    const fechaFinalFormateada = this.formatearFechaParaGuardar(this.incapacidad.fecha_final);
    const diasIncapacidad = this.calcularDiasIncapacidad();

    let json = {
      id_incapacidad: 0 || this.incapacidad.id_incapacidad,
      id_cliente: this.id_cliente,
      id_candidato: this.incapacidad.id_candidato || this.candidatos_busqueda[0].id_candidato,
      folio: this.incapacidad.folio,
      dias_incapacidad: diasIncapacidad,
      fecha_inicial: fechaInicialFormateada,
      fecha_final: fechaFinalFormateada,
      activo: 1,
      token: '012354SDSDS01',
      id_usuario: 1,
    };
    console.log('json :>> ', json);
    this.incapacidadService.guardarIncapacidad(json).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire('Exito', resp.data.mensaje, 'success');
      }
    });
    this.closeModal();
    this.vaciarModelo();
    this.obternerIncapacidades();
  }


  openModal2(){
    this.editar = false;

    this.vaciarModelo();
      this.modal = this.modalService.open(this.modal_mov,{
         size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  vaciarModelo(){
  this.incapacidad = new Incapacidad(0,0,0,'',0,'','',0,'',0)

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
          this.fotoIncapacidad = this.perfilStock
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
    this.fotoIncapacidad = webcamImage.imageAsDataUrl;
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


}
