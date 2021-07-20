import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BajaService } from 'src/app/services/Baja/Baja.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import { ModificacionService } from 'src/app/services/Modificacion/Modificacion.service';

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
  public tipo_titulo = 1;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public table_body : any;

  constructor(
    private compartido_service : CompartidoService,
    private modalService: NgbModal,
    private baja_service : BajaService,
    private modificacion_service : ModificacionService,
    private contrato_service : ContratoService
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

}
