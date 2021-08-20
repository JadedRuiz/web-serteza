import { Component, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Empleado } from 'src/app/models/Empleado';
import { Fotografia } from 'src/app/models/Fotografia';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { EmpleadoService } from 'src/app/services/Empleado/Empleado.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-catalogo-empleado',
  templateUrl: './catalogo_empleado.component.html',
  styleUrls: ['./catalogo_empleado.component.css']
})
export class CatalogoEmpleadoComponent implements OnInit {

  myControl = new FormControl();
  public status = -1;
  public taken = 5;
  public direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public id_nomina = parseInt(window.sessionStorage.getItem("tipo_nomina")+"");
  public empresa = parseInt(window.sessionStorage["empresa"]);
  public candidato = new Candidato(0,0,6,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
  public colonias : any;
  public modal : any;
  public band_persiana = true;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public empleado = new Empleado(0,0,this.id_nomina,0,0,0,0,0,0,this.candidato,"","","","","","","","","","",false,false,false,this.usuario_logueado);
  public empleados : any;
  public foto_user : any;
  public nominas : any;
  public bancos : any;
  public contratos : any;
  public puestos : any;
  public sucursales : any;
  public empleados_busqueda : any;
  public tipo_nomina = -1;
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
  public tipo_modal = 1;

  constructor(
    private empleado_serice : EmpleadoService, 
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private puesto_service : PuestoService,
    private sucursal_service : SucursalService,
    private sanitizer: DomSanitizer
  ) { 
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
  }

  ngOnInit(): void {
    this.mostrarEmpleados();
    this.mostrarCatalogoNomina();
  }

  mostrarEmpleados(){ 
    this.empleados = [];
    let json = {
      id_status : this.status,
      id_nomina : this.tipo_nomina,
      pagina : this.pagina_actual,
      take : this.taken,
      id_empresa : this.empresa
    }
    this.empleado_serice.obtenerEmpleadosPorEmpresa(json)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.empleados = object.data;
      }
    });
  }
  mostrarCatalogoNomina(){
    this.nominas = [];
    this.compartido_service.obtenerCatalogo("nom_cat_nomina")
    .subscribe( (object : any) =>{
      if(object.length > 0){
        this.nominas = object;
      }
    });
  }
  mostrarCatalogoBancos(){
    this.bancos = [];
    this.compartido_service.obtenerCatalogo("sat_catbancos")
    .subscribe( (object : any) =>{
      if(object.length > 0){
        this.bancos = object;
      }
    });
  }
  mostrarCatalogoContratos(){
    this.contratos = [];
    this.compartido_service.obtenerCatalogo("sat_contratossat")
    .subscribe( (object : any) =>{
      if(object.length > 0){
        this.contratos = object;
      }
    });
  }
  mostrarSucursales(){
    this.sucursales = [];
    this.sucursal_service.obtenerSucursales(this.empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.sucursales = object.data;
      }
    });
  }

  mostrarPuestos(){
    this.puestos = [];
    this.puesto_service.obtenerPuestosPorEmpresa(this.empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.puestos = object.data;
      }
    });
  }
  ayudaBusqueda(key : any, tipo : number){
    let json = {
      id_empresa : this.empresa,
      nombre_candidato : key
    };
    let str_texto = "";
    if(tipo == 2){
      str_texto = "El RFC ya se encuentrá registrado como empleado";
    }
    if(tipo == 3){
      str_texto = "El CURP ya se encuentrá registrado como empleado";
    }
    this.empleado_serice.autocompleteEmpleado(json)
    .subscribe( (object : any) => {
      if(object.ok){
        Swal.fire("Información",str_texto,"info");
        this.candidato.curp = "";
        this.candidato.rfc = "";
      }else{
        this.empleado_serice.obtenerCandidatoPorEmpresa(json)
        .subscribe( (object_busqueda : any) => {
          if(object_busqueda.ok){
            this.insertarCandidato(object_busqueda.data[0]);
          }
        });
      }
    });
    
  }
  nuevoEmpleado(){
    this.mostrarPuestos();
    this.mostrarCatalogoBancos();
    this.mostrarCatalogoContratos();
    this.mostrarSucursales();
    this.tipo_modal = 1;
    this.openModal();
  }
  editar(id : any){
   this.empleado_serice.obtenerEmpleadoPorId(id)
   .subscribe( (onject : any) =>{
    if(onject.ok){
      this.mostrarPuestos();
      this.mostrarCatalogoBancos();
      this.mostrarCatalogoContratos();
      this.mostrarSucursales();
      this.tipo_modal = 2;
      this.openModal();
      this.empleado.candidato.id_candidato = onject.data[0].id_candidato;
      this.insertarCandidato(onject.data[0]);
      this.insertarDatoEmpleado(onject.data[0],id);
    }
   }); 
  }
  modificarEmpleado(){
    this.confirmar("Confirmación","¿Seguro que deseas modificar el empleado?","info",3,null);
  }
  getEmpleado(event : any){
    this.editar(event.option.id);
    this.myControl.reset('');
  }

  busqueda(value : string){
    if(value.length > 0){
      this.empleados_busqueda = [];
      let json = {
        nombre_candidato : value,
        id_empresa : this.empresa
      };
      this.empleado_serice.autocompleteEmpleado(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.empleados_busqueda = object.data;
        }
      });
    }
  }

  generarEdad(){
    let convertAge = new Date(this.empleado.candidato.fecha_nacimiento+"");
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    this.empleado.candidato.edad = edad;
  }

  openModal() {
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  modificarMunicipio(){

  }
  getDatos(){

  }
  altaCandidatoAEmpleado(){
    if(this.empleado.aplicarsueldoneto){
      this.empleado.aplicarsueldoneto = 1;
    }else{
      this.empleado.aplicarsueldoneto = 0;
    }
    if(this.empleado.prestaciones_antiguedad){
      this.empleado.prestaciones_antiguedad = 1;
    }else{
      this.empleado.prestaciones_antiguedad = 0;
    }
    if(this.empleado.sinsubsidio){
      this.empleado.sinsubsidio = 1;
    }else{
      this.empleado.sinsubsidio = 0;
    }
    this.confirmar("Confirmación","¿Seguro que deseas agregar al candidato como empleado de está empresa?","info",1,null);
  }
  altaEmpleado(){
    this.confirmar("Confirmación","¿Seguro que deseas agregar al empleado a esta empresa?","info",2,null);
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, data : any){
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
        if(tipo == 1){  //Crear empleado mediante candidato existente
          this.empleado_serice.crearNuevoEmpleadoConCandidatoExistente(this.empleado)
          .subscribe( (object : any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha creado el empleado","success");
              this.mostrarEmpleados();
              this.cerrarModal();
            }
          });
        }
        if(tipo == 2){  //Crear nuevo empleado
          this.empleado_serice.crearNuevoEmpleado(this.empleado)
          .subscribe( (object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha creado el empleado","success");
              this.mostrarEmpleados();
              this.cerrarModal();
            }
          });
        }
        if(tipo == 3){
          this.empleado_serice.modificarEmpleado(this.empleado)
          .subscribe( (object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha modificado el empleado","success");
              this.mostrarEmpleados();
              this.cerrarModal();
            }
          });
        }
      }
    });
  }
  insertarCandidato(arreglo : any){
    //Datos de direccion
    this.candidato.direccion.id_direccion = arreglo.id_direccion;
    this.candidato.direccion.calle = arreglo.calle;
    this.candidato.direccion.numero_exterior = arreglo.numero_exterior;
    this.candidato.direccion.numero_interior = arreglo.numero_interior;
    this.candidato.direccion.cruzamiento_uno = arreglo.cruzamiento_uno;
    this.candidato.direccion.cruzamiento_dos = arreglo.cruzamiento_dos;
    this.candidato.direccion.codigo_postal = arreglo.codigo_postal;
    this.candidato.direccion.colonia = arreglo.colonia;
    this.candidato.direccion.localidad = arreglo.localidad;
    this.candidato.direccion.municipio = arreglo.municipio;
    this.candidato.direccion.estado = arreglo.estado;
    this.candidato.direccion.descripcion = arreglo.descripcion_direccion;
    //Datos de usuario
    this.candidato.id_candidato = arreglo.id_candidato;
    this.candidato.apellido_paterno = arreglo.apellido_paterno;
    this.candidato.apellido_materno = arreglo.apellido_materno;
    this.candidato.id_statu = arreglo.id_status;
    this.candidato.nombre = arreglo.nombre;
    this.candidato.rfc = arreglo.rfc;
    this.candidato.curp = arreglo.curp;
    this.candidato.fecha_nacimiento = arreglo.fecha_nacimiento;
    this.candidato.lugar_nacimiento = arreglo.lugar_nacimiento;
    this.candidato.numero_social = arreglo.numero_seguro;
    this.candidato.descripcion = arreglo.descripcion;
    this.candidato.edad = arreglo.edad;
    this.candidato.correo = arreglo.correo;
    this.candidato.telefono = arreglo.telefono;
    this.candidato.telefono_dos = arreglo.telefono_dos;
    this.candidato.telefono_tres = arreglo.telefono_tres;
    this.candidato.fotografia.id_fotografia = arreglo.id_fotografia;
    this.foto_user = arreglo.fotografia;
  }
  insertarDatoEmpleado(dato : any,id : any){
    this.empleado.id_empleado = id;
    this.empleado.id_nomina = this.id_nomina;
    this.empleado.id_catbanco = dato.id_catbanco;
    this.empleado.id_puesto = dato.id_puesto;
    this.empleado.id_sucursal = dato.id_sucursal;
    this.empleado.id_registropatronal = dato.id_registropatronal;
    this.empleado.id_contratosat = dato.id_contratosat;
    this.empleado.fecha_antiguedad = dato.fecha_antiguedad;
    this.empleado.fecha_ingreso = dato.fecha_ingreso;
    this.empleado.cuenta = dato.cuenta;
    this.empleado.tarjeta = dato.tarjeta;
    this.empleado.clabe = dato.clabe;
    this.empleado.tipo_salario = dato.tipo_salario;
    this.empleado.jornada = dato.jornada;
    this.empleado.sueldo_diario = dato.sueldo_diario;
    this.empleado.sueldo_integrado = dato.sueldo_integrado;
    this.empleado.sueldo_complemento = dato.sueldo_complemento;
    this.empleado.aplicarsueldoneto = dato.aplicarsueldoneto;
    this.empleado.sinsubsidio = dato.sinsubsidio;
    this.empleado.prestaciones_antiguedad = dato.prestaciones_antiguedad;
  }
  limpiarCampos(){
    this.direccion = new Direccion(0,0,"","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","","");
    this.docB64 = "";
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
    this.candidato = new Candidato(0,0,6,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
    this.empleado = new Empleado(0,0,this.id_nomina,0,0,0,0,0,0,this.candidato,"","","","","","","","","","",false,false,false,this.usuario_logueado);
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
    this.mostrarEmpleados();
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

  openModalCamera(){
    this.modal_camera = this.modalService.open(this.contenidoDelModalCamera,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    this.showWebcam = true;
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
    this.showWebcam = false;
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
  
}
