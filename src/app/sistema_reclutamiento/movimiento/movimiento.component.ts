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

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.css']
})
export class MovimientoComponent implements OnInit {

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
  @ViewChild('content_mod', {static: false}) modal_modificacion : any;
  modal_control_mod  : any;
  @ViewChild('content_baja', {static: false}) modal_baja : any;
  modal_control_baja : any;
  //Buscadores
  filterControl = new FormControl();
  candidatos : any;
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  filterControlDepartamento = new FormControl();
  departamentos : any;
  departamentos_busqueda : any;
  filterControlPuestos = new FormControl();
  puestos : any;
  puestos_busqueda : any;
  //Variables
  public nominas : any;
  sucursales : any;
  status = -1;
  tipo = "-1";
  tipo_modal_detalle = 0;
  movimientos : any; 
  detalle_atiguo = {
    empresa : "",
    departamento : "",
    candidato : "",
    puesto : "",
    id_nomina : 0,
    sucursal : "",
    sueldo : "",
    sueldo_neto : "",
    fecha_detalle : "",
    descripcion : "",
    url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
  };
  detalle = {
    id_registro : 0,
    id_movimiento : 0,
    id_candidato : "",
    candidato : "",
    id_puesto : 0,
    puesto : "",
    id_nomina : 0,
    nomina : "",
    id_sucursal : 0,
    empresa : "",
    sucursal : "",
    sueldo : "",
    sueldo_neto : "",
    fecha_mov : "",
    tipo_mov : "",
    fecha_detalle : "",
    descripcion : "",
    url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
  };

  constructor(
    private movimiento_service : MovimientoService,
    private modalService: NgbModal,
    private candidato_service : CandidatoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private currencyPipe : CurrencyPipe,
    private contrato_service : ContratoService,
    private sucursal_service : SucursalService,
    private dateAdapter: DateAdapter<Date>
  ) { 
    this.modal = NgbModalRef;
    this.paginator = MatPaginator;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.obtenerMovimientos();
    this.filterControlEmpresa.disable();
    this.filterControlPuestos.disable();
    this.filterControlDepartamento.disable();
  }

  transformAmount(element : any, tipo : number){
    if(tipo == 1){
      this.detalle.sueldo = this.currencyPipe.transform(this.detalle.sueldo, '$')+"";
      element.target.value = this.detalle.sueldo;
    }
    if(tipo == 2){
      this.detalle.sueldo_neto = this.currencyPipe.transform(this.detalle.sueldo_neto, '$')+"";
      element.target.value = this.detalle.sueldo_neto;
    }
    // if(tipo == 3){
    //   this.puesto.sueldo_tipo_c = this.currencyPipe.transform(this.puesto.sueldo_tipo_c, '$');
    //   element.target.value = this.puesto.sueldo_tipo_c;
    // }
  }

  obtenerMovimientos(){
    let json = {
      id_cliente : this.cliente_seleccionado,
      status : this.status,
      tipo : this.tipo
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
    this.filterControlEmpresa.enable();
    this.detalle.id_candidato = candidato.id_candidato;
    this.detalle.candidato = candidato.nombre;
    if(tipo == 2 || tipo == 3){
      this.detalle_atiguo.url_foto = candidato.fotografia;
      this.movimiento_service.obtenerDetallePorIdCandidato(candidato.id_candidato)
      .subscribe((object : any) => {
        if(object.ok){
          this.detalle_atiguo.puesto = object.data[0].puesto;
          this.detalle_atiguo.empresa = object.data[0].empresa;
          this.detalle_atiguo.departamento = object.data[0].departamento;
          this.detalle_atiguo.id_nomina = object.data[0].id_nomina;
          this.detalle_atiguo.sucursal = object.data[0].sucursal;
          this.detalle_atiguo.sueldo = object.data[0].sueldo;
          this.detalle_atiguo.sueldo_neto = object.data[0].sueldo_neto;
          this.detalle_atiguo.fecha_detalle = object.data[0].fecha_detalle;
          this.detalle_atiguo.descripcion = object.data[0].observacion;
          if(tipo == 3){
            this.detalle.id_puesto = object.data[0].id_puesto;
          }
        }else{
          Swal.fire("Aviso","No se ha podido encontrar la información del empleado","info");
        }
      })
    }
  }

  mostrarEmpresas(){
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
    .subscribe((object : any) => {
      if(object.ok){
        this.empresas = object.data;
        this.empresas_busqueda = object.data;
      }else{
        Swal.fire("Aviso","No se han encontrado empresas configuradas a este cliente","info");
      }
    });
  }

  buscarEmpresa(){
    this.empresas_busqueda = [];
    this.empresas.forEach((element : any) => {
      this.empresas_busqueda.push({
        "empresa" : element.empresa,
        "id_empresa" : element.id_empresa
      });
    });
    if(this.filterControlEmpresa.value.length > 0){
      this.empresas_busqueda = [];
      this.empresas.forEach((element : any) => {
        if(element.empresa.includes(this.filterControlEmpresa.value.toUpperCase())){ 
          this.empresas_busqueda.push({
            "empresa" : element.empresa,
            "id_empresa" : element.id_empresa
          })
        }
      });
    }
  }

  optionEmpresa(value : any){
    this.mostrarDepartamentos(value.option.id);
    this.detalle.empresa = value.option.value;
    this.mostrarSucursales(value.option.id);
  }
  
  mostrarDepartamentos(id_empresa : any){
    let busqueda = {
      id_cliente : this.cliente_seleccionado,
      id_empresa : id_empresa
    };
    this.departamentos_busqueda = [];
    this.departamento_service.obtenerDepartamentosPorIdCliente(busqueda)
    .subscribe((object : any) => {
      if(object.ok){
        this.departamentos_busqueda = object.data;
        this.departamentos = object.data;
        this.filterControlDepartamento.enable();
      }else{
        this.filterControlDepartamento.disable();
        Swal.fire("Aviso","No se han encontrado departamentos en está empresa","info");
      }
    });
  }

  buscarDepartamento(){
    this.departamentos_busqueda = [];
    this.departamentos.forEach((element : any) => {
      this.departamentos_busqueda.push({
        "departamento_busqueda" : element.departamento_busqueda,
        "id_departamento" : element.id_departamento
      });
    });
    if(this.filterControlDepartamento.value.length > 0){
      this.departamentos_busqueda = [];
      this.departamentos.forEach((element : any) => {
        if(element.departamento_busqueda.includes(this.filterControlDepartamento.value.toUpperCase())){ 
          this.departamentos_busqueda.push({
            "departamento_busqueda" : element.departamento_busqueda,
            "id_departamento" : element.id_departamento
          })
        }
      });
    }
  }

  optionDepartamento(value : any){
    this.mostrarPuestos(value.option.id);
  }

  mostrarPuestos(id_departamento : any){
    this.puestos_busqueda = [];
    this.departamento_service.obtenerDepartamentoPorId(id_departamento)
    .subscribe((object : any) => {
      if(object.ok){
        this.puestos_busqueda = object.data.puestos;
        this.puestos = object.data.puestos;
        this.filterControlPuestos.enable();
      }else{
        this.filterControlPuestos.disable();
        Swal.fire("Aviso","No se tiene puestos en este departamento","info");
        
      }
    });
  }

  buscarPuesto(){
    this.puestos_busqueda = [];
    this.puestos.forEach((element : any) => {
      this.puestos_busqueda.push({
        "puesto" : element.puesto,
        "id_puesto" : element.id_puesto
      });
    });
    if(this.filterControlPuestos.value.length > 0){
      this.puestos_busqueda = [];
      this.puestos.forEach((element : any) => {
        if(element.puesto.includes(this.filterControlPuestos.value.toUpperCase())){ 
          this.puestos_busqueda.push({
            "puesto" : element.puesto,
            "id_puesto" : element.id_puesto
          })
        }
      });
    }
  }

  optionPuesto(value : any){
    this.detalle.id_puesto = value.option.id;
    this.detalle.puesto = value.option.value;
  }

  mostrarNominas(){
    this.nominas = [];
    this.contrato_service.obtenerCatalogoNomina()
    .subscribe( (object :any) =>{
      if(object.ok){
        this.nominas = object.data;
      }
    })
  }

  mostrarSucursales(id_empresa : any){
    this.sucursales = [];
    this.sucursal_service.obtenerSucursales(id_empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.sucursales = object.data;
      }else{
        Swal.fire("Aviso","No existen sucursales para esta empresa","info");
      }
    });
  }

  nuevoMovimiento(){
    this.movimientos = [];
    this.openModal(1);
  }

  editarMovimiento(id : any){

  }

  agregarMovimiento(tipo : number){
    this.filterControl.setValue("");
    this.mostrarEmpresas();
    this.mostrarNominas();
    this.limpiarDetalle();
    this.openModal(tipo);
  }

  nuevaAlta(){
    this.detalle.tipo_mov = "A";
    this.movimientos.push(this.detalle);
    this.cerrarModal(2);
  }

  nuevaModificacion(){
    this.detalle.tipo_mov = "M";
    this.movimientos.push(this.detalle);
    this.cerrarModal(3);
  }
  nuevaBaja(){
    this.detalle.tipo_mov = "B";
    this.movimientos.push(this.detalle);
    this.cerrarModal(4);
  }

  guardarMovimiento(){
    let json = {
      usuario_creacion : this.usuario,
      movimientos : this.movimientos
    };
    this.confirmar("Confirmación","¿Seguro que deseas registrar los sig. movimientos?","info",1,json);
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
  
  limpiarDetalle(){
    this.detalle = {
      id_registro : 0,
      id_movimiento : 0,
      id_candidato : "",
      candidato : "",
      id_puesto : 0,
      puesto : "",
      id_nomina : 0,
      nomina : "",
      id_sucursal : 0,
      empresa : "",
      sucursal : "",
      sueldo : "",
      sueldo_neto : "",
      fecha_mov : "",
      tipo_mov : "",
      fecha_detalle : "",
      descripcion : "",
      url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
    }
    this.filterControl.setValue("");
    this.filterControlEmpresa.setValue("");
    this.filterControlPuestos.setValue("");
    this.filterControlDepartamento.setValue("");
    this.filterControlEmpresa.disable();
    this.filterControlPuestos.disable();
    this.filterControlDepartamento.disable();
  }

  openModal(tipo : number){
    if(tipo == 1){
      this.modal = this.modalService.open(this.modal_mov,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.buscarCandidato(6);
      this.modal_control_alta = this.modalService.open(this.modal_alta,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 3){
      this.modal_control_mod = this.modalService.open(this.modal_modificacion,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 4){
      this.modal_control_baja = this.modalService.open(this.modal_baja,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : number){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modal_control_alta.close();
    }
    if(tipo == 3){
      this.modal_control_mod.close();
    }
    if(tipo == 4){
      this.modal_control_baja.close();
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
          
        }
      }
    });
  }
}
