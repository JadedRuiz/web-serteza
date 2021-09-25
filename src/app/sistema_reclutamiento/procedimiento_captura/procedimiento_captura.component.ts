import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Incidencias } from 'src/app/models/Incidencias';
import { ConceptoService } from 'src/app/services/Concepto/Concepto.service';
import { EmpleadoService } from 'src/app/services/Empleado/Empleado.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { COLOR, SERVER_API } from 'src/config/config';
import * as XLSX from 'ts-xlsx';
import { SucursalService } from 'src/app/services/Sucursal/sucursal.service';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';

@Component({
  selector: 'app-procedimiento-captura',
  templateUrl: './procedimiento_captura.component.html',
  styleUrls: ['./procedimiento_captura.component.css']
})
export class ProcedimientoCapturaComponent implements OnInit {

  public color = COLOR;
  public id_nomina = parseInt(window.sessionStorage.getItem("tipo_nomina")+"");
  public tipo_nomina = -1;
  public cliente_seleccionado = parseInt(window.sessionStorage["cliente"]);
  public usuario_logueado = window.sessionStorage.getItem("user");
  public id_periodo = 1;
  public cat_conceptos : any;
  public conceptos_empleado : any;
  public band_editar = false;
  public modal : any;
  public modal_visual : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('visualizar', {static: false}) contenidoDelModalVisual : any;
  myControl = new FormControl();
  public empleados_captura : any;
  public empleados : any;
  public config = [true,true,true];
  public tipo_modal = 1;
  public concepto_diabled = false;
  public empleado_seleccionado = 0;
  public concepto_seleccionado = 0;
  public indice_seleccionado = 0;
  public incidencias = new Incidencias(this.id_nomina,1,[]);
  public concepto = {
    id_concepto : "",
    concepto : "",
    unidades : "",
    saldo : "",
    importe : "",
    ajuste : ""
  };
  arrayBuffer:any;
  file:any;
  data : any;
  public sucursales : any;
  public tipo_sucursal = -1;
  public departamentos : any;
  public tipo_depa = -1;
  public palabra = "";

  constructor(
    private modalService: NgbModal,
    public nomina_service : NominaService,
    private concepto_service : ConceptoService,
    private empleado_service : EmpleadoService,
    private sucursal_service : SucursalService,
    private departamento_service : DepartamentoService
  ) { }

  ngOnInit(): void {
    this.obtenerSucursales();
    this.obtenerDepartamentos();
    this.mostrarEmpleadosParaIncidencias(1);
  }

  obtenerSucursales(){
    this.sucursales = [];
    // this.sucursal_service.obtenerSucursales(this.empresa_seleccionado)
    // .subscribe((object : any) => {
    //   if(object.ok){
    //     this.sucursales = object.data;
    //   }
    // });
  }

  obtenerDepartamentos(){
    this.departamentos = [];
    let json = {
      taken : 999,
      pagina : 0,
      status : 1,
      palabra : "",
      // id_empresa : this.empresa_seleccionado
    };
    this.departamento_service.obtenerDepartamentos(json)
    .subscribe((object  :any) => {
      if(object.ok){
        this.departamentos = object.data.registros;
      }
    });
  }

  adminConcepto(id : any){
    this.tipo_modal = 1;
    this.empleado_seleccionado = id;
    this.limpiarCampos();
    this.openModal();
    this.mostrarConceptos();
  }

  busqueda(value : any){
    this.empleados = [];
    if(value.length > 0){
      this.palabra = value;
      this.mostrarEmpleadosParaIncidencias(2);
    }else{
      this.palabra = "";
    }
  }

  visualizarEmpleado(id : any){
    this.openModalVisualizar();
  }

  mostrarEmpleadosParaIncidencias(tipo : number){
    if(tipo == 1){
      this.empleados_captura = [];
    }
    let json = {
      id_nomina : this.tipo_nomina,
      id_cliente : this.cliente_seleccionado,
      id_sucursal : this.tipo_sucursal,
      id_departamento : this.tipo_depa,
      palabra : this.palabra,
      tipo : tipo
    };
    this.empleado_service.obtenerEmpleadoPorTipoNomina(json)
    .subscribe((object : any) =>{
      if(object.ok){
        if(tipo == 1){
          this.empleados_captura = object.data;
        }
        if(tipo == 2){
          this.empleados = object.data;
        }
      }
    });
  }

  mostrarConceptos(){
    this.cat_conceptos = [];
    // this.concepto_service.obtenerConcpetosPorId(this.empresa_seleccionado)
    // .subscribe( (object : any) => {
    //   if(object.ok){
    //     this.cat_conceptos = object.data;
    //   }
    // });
  }

  mostrarConfig(event : any){
    let object = this.cat_conceptos.filter((x : any) => x.id_concepto === parseInt(event.value))[0];
    if(object.utiliza_unidade){
      this.config[0] = false;
      // this.concepto_seleccionado.unidades = "";
    }
    if(object.utiliza_importe){
      this.config[1] = false;
      // this.concepto_seleccionado.importe = "";
    }
    if(object.utiliza_saldo){
      this.config[2] = false;
      // this.concepto_seleccionado.saldo = "";
    }
  }

  mostrarAcciones(id : any, event : any){
    let object_empleado = this.incidencias.incidencias.filter((x : any) => x.id_empleado === parseInt(id))[0];
    object_empleado.editar = true;
    object_empleado.concepto_seleccionado = event.value;
  }

  mostrarConceptosEmpleado(id : any){
    this.conceptos_empleado = [];
    this.empleado_seleccionado = id;
    this.concepto_service.obtenerConceptosPorIdEmpleado(id,0)
    .subscribe((object : any) => {
      if(object.ok){
        object.data.conceptos_automaticos.forEach((element : any) => {
          this.conceptos_empleado.push({
            id_concepto : element.id_concepto,
            concepto : element.concepto,
            complemento : 0,
            unidades : "",
            importe : "",
            saldo : "",
            automatico : true
          });
        });
        object.data.conceptos_empleado.forEach((element : any) => {
          this.conceptos_empleado.push({
            id_concepto : element.id_concepto,
            concepto : element.concepto,
            complemento : 0,
            unidades : element.unidad,
            importe : element.importe,
            saldo : element.saldo,
            automatico : false
          });
        });
      }
    });
  }

  getEmpleado(event : any){
    this.empleado_seleccionado = parseInt(event.option.id);
    this.editar(parseInt(event.option.id));
    this.myControl.reset("");
    this.empleados = [];
  }

  nuevoConcepto(){
    this.tipo_modal = 1;
    this.mostrarConceptos();
    this.concepto_diabled = false;
    this.openModal();
  }

  agregarConceptoAEmpleado(){
    let json = {
      usuario : this.usuario_logueado,
      id_empleado : this.empleado_seleccionado,
      id_periodo : this.id_periodo,
      concepto : this.concepto
    };
    this.confirmar("Confirmación","¿Seguro que desea agregar este concepto al empleado?","info",json,1);
  }

  editar(id : any){
    this.mostrarConceptosEmpleado(id);
    this.openModalVisualizar();
  }
  
  editarConcepto(id : any){
    this.concepto_seleccionado = id;
    this.concepto_service.obtenerConceptoPorIdMovNomina(id)
    .subscribe((object : any) =>{
      if(object.ok){
        this.mostrarConceptos();
        this.tipo_modal = 2;
        this.concepto_diabled = true;
        let concept = object.data[0];
        this.concepto.id_concepto = concept.id_concepto;
        this.concepto.unidades = concept.unidad;
        this.concepto.importe = concept.importe;
        this.concepto.saldo = concept.saldo;
        this.concepto.ajuste = concept.ajuste;
        if(this.concepto.unidades == "0"){
          this.config[0] = true;
        }else{
          this.config[0] = false;
        }
        if(this.concepto.importe == "0"){
          this.config[1] = true;
        }else{
          this.config[1] = false;
        }
        if(this.concepto.saldo == "0"){
          this.config[2] = true;
        }else{
          this.config[2] = false;
        }
        this.openModal();
      }
    });
  }

  modificarConcepto(){
    let json = {
      id_concepto : this.concepto_seleccionado,
      usuario : this.usuario_logueado,
      concepto : this.concepto
    };
    this.confirmar("Confirmación","¿Seguro que deseas modificar el concepto de este empleado?","info",json,2);
  }

  eliminar(id : any){
    let object_empleado = this.incidencias.incidencias.filter((x : any) => x.id_empleado === parseInt(id))[0];
    let json = {
      id_concepto : object_empleado.concepto_seleccionado,
      usuario : this.usuario_logueado
    };
    this.confirmar("Confirmación","¿Seguro que deseas eliminar el concepto al empleado?","info",json,3);
  }

  openModal() {
    // this.mostrarConceptos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  openModalVisualizar() {
    // this.mostrarConceptos();
    this.modal_visual = this.modalService.open(this.contenidoDelModalVisual,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModalVisualizar(){
    this.modal_visual.close();
  }

  limpiarCampos(){
    this.concepto = {
      id_concepto : "",
      concepto : "",
      unidades : "",
      saldo : "",
      importe : "",
      ajuste : ""
    };
    this.band_editar = false;
    this.config = [true,true,true];
    this.concepto_diabled = false;
  }
  incomingfile(event : any) 
  {
  this.file= event.target.files[0]; 
  this.Upload();
  }
  subirExcel(){
    $("#subir").click();
  }
  Upload() {
    this.data = [];
    let fileReader = new FileReader();
      fileReader.onload = (e : any) => {
          this.arrayBuffer = fileReader.result;
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, {type:"binary"});
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          // XLSX.utils.sheet_to_json(worksheet)
          this.data = (XLSX.utils.sheet_to_json(worksheet, { header: 1}));
          //Se arma el JSON
          if(this.data[0][0] != "Clave"){
            Swal.fire("Ha ocurrido un error","El excel no corresponde al formato correcto","error");
          }else{
            let capturas = [];
            let ids_conceptos = [];
            for(let i=0;i<this.data.length;i++){
              let cont = 0;
              let conceptos_prueba = [];
              for(let o=2;o<this.data[i].length;o++){
                if(i == 0){
                  ids_conceptos.push(this.data[i][o]);
                }
                let conceptos = {
                  id_concepto : ids_conceptos[cont],
                  unidades : "",
                  importe : "",
                  saldo : ""
                };
                if(this.data[i][o] != undefined){
                  conceptos.unidades = this.data[i][o];
                }else{
                  conceptos.unidades = "0";
                }
                o++;
                if(this.data[i][o] != undefined){
                  conceptos.importe = this.data[i][o];
                }else{
                  conceptos.importe = "0";
                }
                o++;
                if(this.data[i][o] != undefined){
                  conceptos.saldo = this.data[i][o];
                }else{
                  conceptos.saldo = "0";
                }
                if(i > 1){
                  cont++;
                }
                conceptos_prueba.push(conceptos);
              }
              if(i > 1){
                capturas.push({
                  id_empleado : this.data[i][0],
                  conceptos : conceptos_prueba
                });
              }
            }
            if(capturas.length>0){
              console.log(capturas);
            }
          }
      }
      fileReader.readAsArrayBuffer(this.file);
  }
  descargarExcel(){
    location.href = SERVER_API+"excel/formatoExcelCaptura/"+0;
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,json : any,tipo : number){
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
        if(tipo == 1){  //nuevo concepto de empleado
          this.concepto_service.altaConceptoAEmpleado(json)
          .subscribe( (object : any) =>{
            if(object.ok){
              //Notificar
              Swal.fire("Buen trabajo",object.data.message,"success");
              this.mostrarConceptosEmpleado(this.empleado_seleccionado);
              this.cerrarModal();
              //Actualizar los conceptos del empleado
              let object_empleado = this.incidencias.incidencias.filter((x : any) => x.id_empleado === parseInt(json.id_empleado))[0];
              object_empleado.conceptos = object.data.conceptos_actuales;
            }else{
              Swal.fire("Ha ocurrido un error",object.data,"error");
            }
          });
        }
        if(tipo == 2){  //modificar concepto de empleaod
          this.concepto_service.modificarConceptoAEmpleado(json)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
              this.mostrarConceptosEmpleado(this.empleado_seleccionado);
              this.cerrarModal();
            }else{
              Swal.fire("Ha ocurrido un error",object.data,"error");
            }
          });
        }
        if(tipo == 3){  //eliminar concepto de empleado
          this.concepto_service.eliminarConceptoAEmpleado(json)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo",object.data,"success");
              this.incidencias.incidencias.forEach((element : any) => {
                element.conceptos.forEach((concepto_row : any, row : any) => {
                  if(concepto_row.id_concepto == json.id_concepto){
                    element.conceptos.splice(row,1);
                    element.editar = false;
                  }
                });
              });
              this.cerrarModal();
            }else{
              Swal.fire("Ha ocurrido un error",object.data,"error");
            }
          });
        }
      }
    });
  }
}
