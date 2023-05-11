import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VacacionesService } from 'src/app/services/Reclutamiento/Vacaciones.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proced-vacaciones',
  templateUrl: './proced_vacaciones.component.html',
  styleUrls: ['./proced_vacaciones.component.css']
})
export class ProcedVacacionesComponent implements OnInit {

    //Variables config
    public color = COLOR;
    public id_usuario = parseInt(window.sessionStorage.getItem("user")+"");
    public id_perfil = parseInt(window.sessionStorage.getItem("perfil")+""); 
    public id_empleado = parseInt(window.sessionStorage.getItem("id_empleado")+""); 
    filterControlEmpleados = new FormControl();
    bDisp = false;
    btnColor = "btn-info";
    objEmpleados : any;
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
    this.arraySolicitudes = [1,2,3,4];
  }

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
}
