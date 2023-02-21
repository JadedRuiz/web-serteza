import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DepartamentoService } from 'src/app/services/Reclutamiento/Departamento.service';
import { MovimientoService } from 'src/app/services/Reclutamiento/Movimiento.service';
import { COLOR } from 'src/config/config';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import Swal from 'sweetalert2';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import { SERVER_API } from 'src/config/config';
import { element } from 'protractor';
import { CompartidoService } from 'src/app/services/Reclutamiento/Compartido.service';
import { EmpleadoService } from 'src/app/services/Empleado/Empleado.service';

@Component({
  selector: 'app-procedimiento-baja',
  templateUrl: './procedimiento_baja.component.html',
  styleUrls: ['./procedimiento_baja.component.css']
})
export class ProcedimientoBajaComponent implements OnInit {

  //Variables config
  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  //Modelo tabla
  displayedColumns: string[] = ['id_movimiento', 'usuario_creacion', "fecha_movimiento", 'tipo', 'status', "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  //Modales
  @ViewChild('content', {static: false}) modal_mov : any;
  modal : any;
  @ViewChild('content_alta', {static: false}) modal_alta : any;
  modal_control_alta : any;
  //Buscadores
  filterControl = new FormControl();
  candidatos : any;
  puestos : any;
  puestos_busqueda : any;
  //Variables
  public nominas : any;
  sucursales : any;
  status = -1;
  tipo = "-1";
  tipo_modal = 1;
  tipo_modal_alta = 1;
  movimientos : any; 
  detalle = {
    id_registro : 0,
    id_detalle : 0,
    id_candidato : 0,
    candidato : "",
    puesto : "",
    nomina : "",
    empresa : "",
    sucursal : "",
    sueldo : "",
    sueldo_neto : "",
    fecha_baja : "",
    fecha_detalle : "",
    descripcion : "",
    departamento : "",
    url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
  };
  movimiento_seleccionado = 0;

  constructor(
    private movimiento_service : MovimientoService,
    private modalService: NgbModal,
    private candidato_service : CandidatoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private currencyPipe : CurrencyPipe,
    private contrato_service : ContratoService,
    private sucursal_service : SucursalService,
    private dateAdapter: DateAdapter<Date>,
    private compartido_service : CompartidoService,
    private empleado_service : EmpleadoService
  ) { 
    this.modal = NgbModalRef;
    this.paginator = MatPaginator;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.obtenerMovimientos();
  }

  obtenerMovimientos(){
    let json = {
      id_cliente : this.cliente_seleccionado,
      status : this.status,
      tipo : "B"
    }
    this.movimiento_service.obtenerMovimientosReclutamiento(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  buscarCandidato(status : number){
    this.candidatos = [];
    if(this.filterControl.value.length > 2 || this.filterControl.value == ""){
      let json = {
        nombre_candidato : this.filterControl.value.toUpperCase(),
        status : status,
        id_cliente : this.cliente_seleccionado
      };
      this.candidato_service.autoCompleteCandidato(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.candidatos = object.data;
        }
      })
    }
  }

  optionCandidato(event : any, tipo : number){
    let candidato = this.candidatos.filter( (x : any) => x.id_candidato === parseInt(event.option.id))[0];
    this.detalle.url_foto = candidato.fotografia;
    this.detalle.id_candidato = candidato.id_candidato;
    this.detalle.candidato = candidato.nombre;
    this.empleado_service.obtenerEmpleadoPorIdCandidato(candidato.id_candidato)
    .subscribe((object : any) => {
      if(object.ok){
        this.detalle.puesto = object.data.puesto;
        this.detalle.empresa = object.data.empresa;
        this.detalle.departamento = object.data.departamento;
        this.detalle.nomina = object.data.nomina;
        this.detalle.sucursal = object.data.sucursal;
        this.detalle.sueldo = object.data.sueldo_diario;
        this.detalle.sueldo_neto = object.data.sueldo_integrado;
        this.detalle.fecha_detalle = object.data.fecha_ingreso;
      }else{
        Swal.fire("Aviso","No se ha podido encontrar la información del empleado","info");
      }
    });
  }

  nuevaPrecaptura(){
    this.tipo_modal = 1;
    this.movimiento_seleccionado = 0;
    this.filterControl.enable();
    this.movimientos = [];
    this.openModal(1);
  }

  editarPrecaptura(id : any){
    this.tipo_modal = 2;
    this.movimiento_seleccionado = id;
    this.movimiento_service.obtenerDetalleBaja(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.movimientos = object.data;
        this.openModal(1);
      }else{
        Swal.fire("Aviso","No se ha podido encontrar la información del empleado","info");
      }
    });
  }

  nuevaContratacion(){
    this.filterControl.enable();
    this.filterControl.setValue("");
    this.tipo_modal_alta = 1;
    this.limpiarDetalle();
    this.buscarCandidato(1);
    this.openModal(2);
  }

  agregarContratacion(){
    if(this.detalle.id_candidato != 0){
      this.detalle.id_registro = this.movimientos.length + 1;
      this.detalle.descripcion = this.detalle.descripcion.toUpperCase();
      this.movimientos.push(this.detalle);
      this.tipo_modal_alta = 1;
      this.cerrarModal(2);
    }else{
      Swal.fire("Aviso","Primero ingresa el nombre del empleado a dar de baja","info");
    }
    
  }

  editarContratacion(id_registro : number){
    this.movimientos.forEach((element : any) => {
      if(element.id_registro == id_registro){
        this.tipo_modal_alta = 2;
        if(this.tipo_modal == 1){
          this.filterControl.disable();
          this.filterControl.setValue(element.candidato);
        }else{
          this.filterControl.disable();
          this.filterControl.setValue(element.candidato);
        }
        this.detalle = element;
        this.openModal(2);
      }
    });
  }

  modificarContratacion(){
    this.detalle.descripcion = this.detalle.descripcion.toUpperCase();
    this.cerrarModal(2);
  }

  guardarMovimiento(){
    if(this.tipo_modal == 1){
      let json = {
        usuario_creacion : this.usuario,
        id_cliente : this.cliente_seleccionado,
        tipo_mov : "B",
        movimientos : this.movimientos
      };
      this.confirmar("Confirmación","¿Seguro que deseas registrar los sig. movimientos?","info",1,json);
    }
    if(this.tipo_modal == 2){
      let json = {
        usuario_creacion : this.usuario,
        id_movimiento : this.movimiento_seleccionado,
        tipo_mov : "B",
        movimientos : this.movimientos
      };
      this.confirmar("Confirmación","¿Seguro que deseas modificar la precaptura?","info",2,json);
    }
  }

  cancelarDetalle(id_registro : number, id : number){
    this.movimientos.forEach((element : any, indice : any) => {
      if(element.id_registro == id_registro){
        this.confirmar("Aviso","¿Seguro que deseas eliminar esta contratación?","info",4,{
          indice : indice,
          id : id
        });
      }
    });
  }

  cancelarPrecaptura(id : number){
    this.confirmar("Confirmación","¿Seguro que deseas cancelar la Precaptura?","info",3,id);
  }
  
  aplicarPrecatura(id : number){
    this.confirmar("Confirmación","¿Seguro que deseas aplicar la precaptura? Una vez aplicada ya no podras realizar más cambios","info",5,id);
  }

  descargarReporte(id : number){
    location.href = SERVER_API+"contratacion/obtenerDocContratacion/"+id;
  }
  
  consumoReporte(tipo : any,id_detalle : any){
    if(tipo == 1){
      window.open(SERVER_API+'reporte/reporteContrato/'+id_detalle);
    }
    if(tipo == 2){
      window.open(SERVER_API+'reporte/reporteContratado/'+id_detalle);
    }
  }
  
  visualizarDetalle(id : number){
    this.tipo_modal = 3;
    this.movimiento_service.obtenerDetalleBaja(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.movimientos = object.data;
        this.openModal(1);
      }else{
        Swal.fire("Aviso","No se ha podido encontrar la información del empleado","info");
      }
    });
  }

  realizarContratacion(id : number){
    this.confirmar("Confirmación","¿Seguro que deseas aplicar la precaptura?","info",6,id);
  }

  limpiarDetalle(){
    this.detalle = {
      id_registro : 0,
      id_detalle : 0,
      id_candidato : 0,
      candidato : "",
      puesto : "",
      nomina : "",
      empresa : "",
      sucursal : "",
      sueldo : "",
      sueldo_neto : "",
      fecha_baja : "",
      fecha_detalle : "",
      descripcion : "",
      departamento : "",
      url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
    }
    this.filterControl.setValue("");
  }

  openModal(tipo : number){
    if(tipo == 1){
      this.modal = this.modalService.open(this.modal_mov,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modal_control_alta = this.modalService.open(this.modal_alta,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : number){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modal_control_alta.close();
    }
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number,json : any){
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
          this.movimiento_service.altaMovimiento(json)
          .subscribe((object : any) => {
              if(object.ok){
                this.obtenerMovimientos();
                this.cerrarModal(1);
                Swal.fire("Buen trabajo","Se han dado de alta los movimientos","success");
              }
          })
        }
        if(tipo == 2){  //Editar
          this.movimiento_service.modificarMovimiento(json)
          .subscribe((object : any) => {
              if(object.ok){
                Swal.fire("Buen trabajo","Se ha moficado la contratación","success");
                this.limpiarDetalle();
                this.cerrarModal(2);
              }
          });
        }
        if(tipo == 3){
          this.movimiento_service.cancelarMovimiento(json)
          .subscribe((object : any) => {
            if(object.ok){
              this.obtenerMovimientos();
              Swal.fire("Buen trabajo","Se ha cancelado la precaptura de contración","success");
            }
          });
        }
        if(tipo == 4){
          this.movimiento_service.cancelarDetalle(json.id)
          .subscribe((object : any) => {
            this.movimientos.splice(json.indice,1);
            Swal.fire("Buen trabajo","La contratación ha sido cancelada","success");  
          });
        }
        if(tipo == 5){
          this.movimiento_service.cambiarStatusMov(8,json)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","La precaptura ha sido aplicada","success"); 
              this.obtenerMovimientos();
            }
          })
        }
        if(tipo == 6){
          let data = {
            id_movimiento : json,
            usuario_creacion : this.usuario,
            tipo_mov : "B"
          };
          this.movimiento_service.aplicarMovimiento(data)
          .subscribe((object : any) => {
            if(object.ok){
              if(object.data.tipo == 1){
                Swal.fire("Buen trabajo","La precaptura ha sido aplicada con éxito","success");
              }
              if(object.data.tipo == 2){
                let string = "";
                object.data.errores.forEach((element : any)=>{
                  string += "° "+element+"\n";
                });
                Swal.fire("Aviso","Una o varias contrataciones de la precaptura no han podido ser aplicadas \n"+string,"info");
              }
              this.obtenerMovimientos();
            }
          });
        }
      }
    });
  }
}
