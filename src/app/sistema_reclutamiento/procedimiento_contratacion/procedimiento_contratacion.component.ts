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
import { ReporteService } from 'src/app/services/Reclutamiento/Reporte.service';

@Component({
  selector: 'app-procedimiento-contratacion',
  templateUrl: './procedimiento_contratacion.component.html',
  styleUrls: ['./procedimiento_contratacion.component.css']
})
export class ProcedimientoContratacionComponent implements OnInit {

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
  @ViewChild('content_import', {static: false}) modal_excel : any;
  modal_control_excel: any;
  @ViewChild('content_load', {static: false}) modal_carga : any;
  modal_control_carga: any;
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
  tipo_modal = 1;
  tipo_modal_alta = 1;
  movimientos : any; 
  detalle = {
    id_registro : 0,
    id_detalle : 0,
    id_candidato : "",
    candidato : "",
    id_puesto : 0,
    puesto : "",
    id_nomina : 0,
    nomina : "",
    id_sucursal : 0,
    empresa : "",
    id_empresa : 0,
    sucursal : "",
    sueldo : "",
    sueldo_neto : "",
    fecha_mov : "",
    fecha_detalle : "",
    fecha_antiguedad : "",
    descripcion : "",
    departamento : "",
    id_departamento : 0,
    url_foto : "./assets/img/defaults/usuario_por_defecto.svg"
  };
  movimiento_seleccionado = 0;
  band_errores = false;
  errores : any;
  nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
  importe = {
    file : "",
    id_cliente : this.cliente_seleccionado,
    usuario_creacion : this.usuario
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
    private dateAdapter: DateAdapter<Date>,
    private compartido_service : CompartidoService,
    private reporte_service : ReporteService
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
  }

  obtenerMovimientos(){
    let json = {
      id_cliente : this.cliente_seleccionado,
      status : this.status,
      tipo : "A"
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
    this.detalle.id_empresa = value.option.id;
    this.mostrarSucursales(value.option.id);
    this.filterControlDepartamento.setValue("");
    this.filterControlPuestos.setValue("");
    this.filterControlPuestos.disable();
    this.detalle.id_sucursal = 0;
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
    this.filterControlPuestos.setValue("");
    this.detalle.id_departamento = value.option.id;
    this.detalle.departamento = value.option.value;
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
    this.movimiento_service.obtenerDetallePorId(id)
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
    this.filterControl.setValue("");
    this.tipo_modal_alta = 1;
    this.mostrarEmpresas();
    this.mostrarNominas();
    this.limpiarDetalle();
    this.openModal(2);
  }

  importarExcel(){
    if(this.importe.file == ""){
      Swal.fire("Aviso","Primero adjunta un arhivo valido","info");
    }else{
      this.openModal(4);
      this.movimiento_service.enviarExcel(this.importe)
      .subscribe((object : any) => {
        if(object.ok){
          if(object.data.errores.length > 0){
            this.errores = object.data.errores;
            this.band_errores = true;
            this.obtenerMovimientos();
            this.cerrarModal(4);
          }else{
            this.obtenerMovimientos();
            this.cerrarModal(3);
            this.cerrarModal(4);
            Swal.fire("Buen trabajo","Los trabajadores se han capturado","success");
          }
        }else{
          this.cerrarModal(4);
          Swal.fire("Ha ocurrido un error", object.message, 'error');
        }
      },
      (err : any) => {
        this.cerrarModal(4);
      })
    }
  }

  agregarContratacion(){
    let puesto = this.puestos.filter( (x : any) => x.id_puesto === this.detalle.id_puesto)[0];
    let autorizados = puesto.autorizados;
    let validador = 0;
    this.compartido_service.obtenerContratados(this.detalle.id_puesto)
    .subscribe((object : any) => {
      validador = validador + object;
      this.movimientos.forEach((element : any) => {
        if(element.id_puesto == this.detalle.id_puesto){
          validador++;
        }
      });
      if(validador >= autorizados){
        Swal.fire("Aviso","El puesto que se ha seleccionado ya se encuentra lleno, aumenta la capacidad e intentelo de nuevo","info");
      }else{
        this.detalle.id_registro = this.movimientos.length + 1;
        this.detalle.descripcion = this.detalle.descripcion.toUpperCase();
        this.movimientos.push(this.detalle);
        this.tipo_modal_alta = 1;
        this.cerrarModal(2);
      }
    });
  }

  editarContratacion(id_registro : number){
    this.movimientos.forEach((element : any) => {
      if(element.id_registro == id_registro){
        this.mostrarEmpresas();
        this.mostrarNominas();
        this.mostrarDepartamentos(element.id_empresa);
        this.mostrarPuestos(element.id_departamento);
        this.mostrarSucursales(element.id_empresa);
        this.tipo_modal_alta = 2;
        if(this.tipo_modal == 1){
          this.filterControl.disable();
          this.filterControlEmpresa.enable();
          this.filterControlEmpresa.setValue(element.empresa);
          this.filterControlDepartamento.enable();
          this.filterControlDepartamento.setValue(element.departamento);
          this.filterControlPuestos.enable();
          this.filterControlPuestos.setValue(element.puesto);
          this.filterControl.setValue(element.candidato);
        }else{
          this.filterControl.disable();
          this.filterControlEmpresa.enable();
          this.filterControlEmpresa.setValue(element.empresa);
          this.filterControlDepartamento.enable();
          this.filterControlDepartamento.setValue(element.departamento);
          this.filterControlPuestos.enable();
          this.filterControlPuestos.setValue(element.puesto);
          this.filterControl.setValue(element.candidato_uno);
        }
        this.detalle = element;
        this.openModal(2);
      }
    });
  }

  modificarContratacion(){
    let puesto = this.puestos.filter( (x : any) => x.id_puesto === this.detalle.id_puesto)[0];
    let autorizados = puesto.autorizados;
    let validador = 0;
    this.compartido_service.obtenerContratados(this.detalle.id_puesto)
    .subscribe((object : any) => {
      validador = validador + object;
      this.movimientos.forEach((element : any) => {
        if(element.id_puesto == this.detalle.id_puesto){
          validador++;
        }
      });
      if(validador >= autorizados){
        Swal.fire("Aviso","El puesto que se ha seleccionado ya se encuentra lleno, aumenta la capacidad e intentelo de nuevo","info");
      }else{
        this.detalle.descripcion = this.detalle.descripcion.toUpperCase();
        this.cerrarModal(2);
      }
    });
  }

  guardarMovimiento(){
    if(this.tipo_modal == 1){
      let json = {
        usuario_creacion : this.usuario,
        id_cliente : this.cliente_seleccionado,
        tipo_mov : "A",
        movimientos : this.movimientos
      };
      this.confirmar("Confirmación","¿Seguro que deseas registrar los sig. movimientos?","info",1,json);
    }
    if(this.tipo_modal == 2){
      let json = {
        usuario_creacion : this.usuario,
        id_movimiento : this.movimiento_seleccionado,
        tipo_mov : "A",
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
      this.reporte_service.reporteGeneral(id_detalle)
      .subscribe((object : any) => {
        if(object.ok){
          let win = window.open("ReporteAlta","_blank");
          let html = '';
          html += '<html>';
          html += '<body style="margin:0!important">';
          html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data+'" type="application/pdf" />';
          html += '</body>';
          html += '</html>';
          win?.document.write(html);
        }
      });
      // window.open(SERVER_API+'reporte/reporteContrato/'+id_detalle);
    }
    if(tipo == 2){
      this.reporte_service.reporteContrato(id_detalle)
      .subscribe((object : any) => {
        if(object.ok){
          let win = window.open("ReporteAlta","_blank");
          let html = '';
          html += '<html>';
          html += '<body style="margin:0!important">';
          html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data+'" type="application/pdf" />';
          html += '</body>';
          html += '</html>';
          win?.document.write(html);
        }
      });
    }
    if(tipo == 3){
      this.movimiento_service.obtenerFormatoAlto({id_cliente : this.cliente_seleccionado})
      .subscribe((object : any) => {
        if(object.ok){
          var arrayBuffer = this.base64ToArrayBuffer(object.data);
          var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
          var data = window.URL.createObjectURL(newBlob);
          let link  = document.createElement('a');
          link.href = data;
          link.download = "FormatoAlta.xlsx";
          link.click();
        }
      });
    }
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  visualizarDetalle(id : number){
    this.tipo_modal = 3;
    this.movimiento_service.obtenerDetallePorId(id)
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
      id_candidato : "",
      candidato : "",
      id_puesto : 0,
      puesto : "",
      id_nomina : 0,
      nomina : "",
      id_sucursal : 0,
      empresa : "",
      id_empresa : 0,
      sucursal : "",
      sueldo : "",
      sueldo_neto : "",
      fecha_mov : "",
      fecha_detalle : "",
      fecha_antiguedad : "",
      descripcion : "",
      departamento : "",
      id_departamento : 0,
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
      this.band_errores = false;
      this.importe = {
        file : "",
        id_cliente : this.cliente_seleccionado,
        usuario_creacion : this.usuario
      };
      this.nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
      this.modal_control_excel = this.modalService.open(this.modal_excel,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 4){
      this.modal_control_carga = this.modalService.open(this.modal_carga,{ size: 'sm', centered : true, backdropClass : 'light-blue-backdrop', backdrop: 'static', keyboard: false});
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
      this.modal_control_excel.close();
    }
    if(tipo == 4){
      this.modal_control_carga.close();
    }
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "xlsx"){
       this.nombre_archivo = archivos.name;
       this.convertirFileAB64(archivos).then( respuesta => {
        this.importe.file = respuesta+"";
      });
      }else{
        this.nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
        Swal.fire("Ha ocurrido un error","Tipo de archivo no permitido","error");
      }
    }
  }

  convertirFileAB64(fileInput : any){
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
            tipo_mov : "A"
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
