import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Concepto, ConceptoUnitario } from 'src/app/models/Concepto';
import { Incidencia } from 'src/app/models/Incidencia';
import { ConceptoService } from 'src/app/services/Concepto/concepto.service';
import { EmpleadoService } from 'src/app/services/Empleado/Empleado.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { SERVER_API } from 'src/config/config';
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-procedimiento-captura',
  templateUrl: './procedimiento_captura.component.html',
  styleUrls: ['./procedimiento_captura.component.css']
})
export class ProcedimientoCapturaComponent implements OnInit {

  public id_nomina = window.sessionStorage.getItem("tipo_nomina");
  public empresa_seleccionado = parseInt(window.sessionStorage["empresa"]);
  public nominas : any;
  public tb_row = {
    id_concepto : 0,
    concepto : "",
    unidades : "",
    importe : "",
    saldo : "",
    ajuste : ""
  };
  public tb_row_dos = {
    id_concepto : 0,
    concepto : "",
    unidades : "",
    importe : "",
    saldo : "",
    ajuste : ""
  };
  public cat_conceptos : any;
  public conceptos = new Array<Concepto>();
  public concepto_agreagado = new Array<ConceptoUnitario>();
  public band_botones = false;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public capturas = new Incidencia(parseInt(this.id_nomina+""),this.conceptos);
  myControl = new FormControl();
  public empleados : any;
  public config = [true,true,true];
  public tipo_modal = 1;
  public empleado_seleccionado = 0;
  public indice_seleccionado = 0;
  arrayBuffer:any;
  file:any;
  data : any;

  constructor(
    private modalService: NgbModal,
    public nomina_service : NominaService,
    private empleado_service : EmpleadoService,
    private concepto_service : ConceptoService
  ) { }

  ngOnInit(): void {
    this.obtenerNomina();
    this.mostrarCapturas();
  }
  obtenerNomina(){
    this.nominas = [];
    let json = {
      id_empresa : this.empresa_seleccionado,
      id_status : 1
    };
    this.nomina_service.obtenerLigaEmpresaNomina(json)
    .subscribe( (object : any) => {
      if(object.ok){
        if(object.data.length > 1){
          this.nominas = object.data;
        }
      }else{
        Swal.fire("Ha ocurrido un error","Este empresa no cuenta con tipos de nómina","error");
      }
    });
  }

  guardar(id : any){
    this.tipo_modal = 1;
    this.empleado_seleccionado = id;
    this.limpiarCampos();
    this.openModal();
    this.mostrarConceptos();
  }

  busqueda(value : any){
    this.empleados = [];
    let json = {
      id_empresa : this.empresa_seleccionado,
      id_status : -1,
      nombre_candidato : value
    };
    this.empleado_service.autocompleteEmpleado(json)
    .subscribe( (object : any) => {
      if(object.ok){
        this.empleados = object.data;
      }
    });
  }

  mostrarCapturas(){
    this.capturas.registros = [];
    let json = {
      id_empresa : this.empresa_seleccionado,
      id_nomina : this.capturas.id_nomina
    };
    this.empleado_service.obtenerEmpleadoPorTipoNomina(json)
    .subscribe( (object : any) =>{
      if(object.ok){
        object.data.forEach((element : any) => {
          let capturas_row = new Concepto(element.id_empleado,element.id_empleado,element.nombre,element.fotografia,"","","",JSON.parse(JSON.stringify(this.concepto_agreagado)));
          this.capturas.registros.push(capturas_row);
        });
      }
    });
  }

  mostrarConceptos(){
    this.cat_conceptos = [];
    this.concepto_service.obtenerConcpetosPorId(this.empresa_seleccionado)
    .subscribe( (object : any) => {
      if(object.ok){
        this.cat_conceptos = object.data;
      }
    });
  }

  mostrarConfig(event : any){
    let object = this.cat_conceptos.filter((x : any) => x.id_concepto === parseInt(event.value))[0];
    this.tb_row.concepto = object.concepto;
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

  mostrarAcciones(id : any){
    this.capturas.registros.forEach((element : any) => {
      if(element.id_empleado = id){
        element.conceptos.forEach((conceptos : any) => {
          if(conceptos.id_concepto == this.tb_row_dos.id_concepto){
            element.unidades =  conceptos.unidades;
            element.importe =  conceptos.importe;
            element.saldo =  conceptos.saldo;
          }
        });
      }
    });
    this.tb_row_dos.id_concepto
  }

  getEmpleado(event : any){
    // this.concepto_seleccionado.id_empleado = parseInt(event.option.id);
    // this.band_botones = true;
    // this.concepto_seleccionado.empleado = event.option.value;
  }

  agregarCalculo(){
    if(this.tb_row.id_concepto != 0){
      this.capturas.registros.forEach( (element : any) => {
        if(element.id_empleado == this.empleado_seleccionado){
          element.conceptos.push(JSON.parse(JSON.stringify(this.tb_row)));
        }
        Swal.fire("Buen trabajo","Se ha agregado el concepto","success");
        this.cerrarModal();
      });
    }else{
      Swal.fire("Ha ocurrido un error","No se puede agregar un concepto vacio","info");
    }
  }

  editar(id : any){
    this.tipo_modal = 2;
    this.band_botones = false;
    this.openModal();
    // this.calculos.registros.forEach((element : any) => {
    //   if(element.folio == id){
    //     this.concepto_seleccionado.folio = id;
    //     this.concepto_seleccionado.id_concepto = element.id_concepto;
    //     this.concepto_seleccionado.concepto = element.concepto;
    //     this.concepto_seleccionado.unidades = element.unidades;
    //     this.concepto_seleccionado.importe = element.importe;
    //     this.concepto_seleccionado.ajuste = element.ajuste;
    //     this.concepto_seleccionado.saldo = element.saldo;
    //   }
    // });
  }

  // editarIncidencia(){
  //   this.calculos.registros.forEach((element : any) => {
  //     if(element.folio == this.concepto_seleccionado.folio){
  //       element.id_concepto = this.concepto_seleccionado.id_concepto;
  //       element.concepto = this.concepto_seleccionado.concepto;
  //       element.unidades = this.concepto_seleccionado.unidades;
  //       element.importe = this.concepto_seleccionado.importe;
  //       element.saldo = this.concepto_seleccionado.saldo;
  //       element.ajuste = this.concepto_seleccionado.ajuste;
  //       Swal.fire("Buen trabajo","Se ha editado el concepto","success");
  //       this.cerrarModal();
  //     }
  //   });
  // }

  eliminar(id : any){
    this.confirmar("Confirmación","¿Seguro que deseas eliminar la incidencia","info",id,2);
  }
  
  openModal() {
    // this.mostrarConceptos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  limpiarCampos(){
    this.config = [true,true,true];
    this.tb_row = {
      id_concepto : 0,
      concepto : "",
      unidades : "",
      importe : "",
      saldo : "",
      ajuste : ""
    };
    // this.concepto_seleccionado = new Concepto(0,0,0,"","",[]);
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
    location.href = SERVER_API+"excel/formatoExcelCaptura/"+this.empresa_seleccionado;
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
        if(tipo == 1){  //Guardar
          
        }
        if(tipo == 2){  //Eliminar
          this.capturas.registros.forEach((element : any, index : any) => {
            if(element.folio == json){
              this.capturas.registros.splice(index,1);
              Swal.fire("Buen trabajo","Se ha editado el concepto","success");
              this.cerrarModal();
            }
          });
        }
      }
    });
  }
}
