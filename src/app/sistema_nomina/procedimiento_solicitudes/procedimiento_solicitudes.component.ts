import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BajaService } from 'src/app/services/Baja/Baja.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import { ModificacionService } from 'src/app/services/Modificacion/Modificacion.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedimiento-solicitudes',
  templateUrl: './procedimiento_solicitudes.component.html',
  styleUrls: ['./procedimiento_solicitudes.component.css']
})
export class ProcedimientoSolicitudesComponent implements OnInit {

  public fecha_inicial : any;
  public fecha_final : any;
  public taken = 5;
  myControl = new FormControl();
  public solicitudes : any;
  public id_empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public tipo_titulo = 1;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public table_body : any;
  public solicitud_seleccionada = 0;

  constructor(
    private compartido_service : CompartidoService,
    private modalService: NgbModal,
    private baja_service : BajaService,
    private modificacion_service : ModificacionService,
    private contrato_service : ContratoService,
    private nomina_service : NominaService
  ) { }

  ngOnInit(): void {
    this.mostrarSolicitudes();
  }

  guardar(){

  }

  mostrarSolicitudes(){
    this.solicitudes = [];
    this.compartido_service.obtenerMovimientos(this.id_empresa)
    .subscribe( (object : any) => {
      if(object.length > 0){
        this.solicitudes = object;
      }
    });
  }

  verSolicitud(id : any, tipo : any){
    this.table_body = [];
    this.openModal();
    this.solicitud_seleccionada = id;
    switch(tipo){
      case "Alta" :
        this.tipo_titulo = 1;
        this.contrato_service.obtenerMoviemientosContratacionPorId(id)
        .subscribe( (object : any) => {
          if(object.ok){
            this.table_body = object.data;
          }
        });
        break;
      case "Modificación" :
        this.tipo_titulo = 2;
        this.modificacion_service.obtenerDetalleModificacion(id)
        .subscribe( (object : any) => {
          if(object.ok){
            this.table_body = object.data;
          }
        });
        break;
      case "Baja" :
        this.tipo_titulo = 3;
        break;
    }
  }

  aplicarSolicitud(){
    if(this.solicitud_seleccionada != 0){
      let json = {
        id_movimiento : this.solicitud_seleccionada,
        usuario : this.usuario
      }
      this.confirmar("Confirmación","¿Seguro que deseas aplicar la solicitud?","info",1,json);
    }
  }

  busqueda(value : any){

  }
  
  getSolicitud(event : any){

  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, json : any){
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
        if(tipo == 1){  //Aplicar solicitud
          this.nomina_service.aplicarSolicitudesRH(json)
          .subscribe((res : any) => {
            if(res.ok){
              this.mostrarSolicitudes();
              this.cerrarModal();
              Swal.fire("Buen trabajo",res.data,"success");
            }
          });
        }
      }
    });
  }

}
