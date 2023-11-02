import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VacacionesService } from 'src/app/services/Reclutamiento/Vacaciones.service';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import Swal from 'sweetalert2';

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

  constructor(
    private modalService: NgbModal,
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


}
