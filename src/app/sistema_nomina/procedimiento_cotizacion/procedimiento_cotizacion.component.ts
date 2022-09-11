import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-procedimiento-cotizacion',
  templateUrl: './procedimiento_cotizacion.component.html',
  styleUrls: ['./procedimiento_cotizacion.component.css']
})
export class ProcedimientoCotizacionComponent implements OnInit {

  public autocomplete = Array();
  public puestos = Array();
  public empresas = Array();
  public json = {
        "folio": "",
        "cliente": "",
        "fecha": (new Date()).toJSON().slice(0,10),
        "id_empresa": "",
        "empresa" : "",
        "correo": "",
        "detalle" : Array()
  };
  public pieChartLabels: Label[] = ['Ahorro','Estrategia','Costo Real'];
  public pieChartData : ChartDataSets[] = [
    { data : [3000,77000,80000], backgroundColor : [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],}
  ];
    
  public texto_folio = "Aún no se ha realizado una cotización o busqueda por folio";
  public class_folio_dos = "d-none";
  @ViewChild('modal_visualizacion', {static: false}) contenidoDelModal : any;
  public modal : any;
  public datos_cotizacion = {
    "cotizacion": {
      "sueldos": 0,
      "imss_obrero": 0,
      "ims_patronal": 0,
      "isn": 0
    },
    "cotizacion_estrategia": {
        "sueldos": 0,
        "imss_obrero": 0,
        "ims_patronal": 0,
        "isn": 0
    }
  };

  constructor(
    private nomina_service : NominaService,
    private modalService: NgbModal
  ) { 
    this.modal = NgbModalRef;
  }

  ngOnInit(): void { 
    this.obtenerEmpresas();
    this.obtenerPuestos();
   }
  
  obtenerEmpresas(){
    this.empresas = [
      { id_empresa : "1", value : "CRH INNOVACION"},
      { id_empresa : "2", value : "SERTEZA"},
      { id_empresa : "3", value : "DOMINA"},
      { id_empresa : "4", value : "FACTOR 9"}
    ]
  }

  selectEmpresa(event : any){
    let empresa = this.empresas.filter((element : any) => element.id_empresa == event.option.value)[0];
    this.json.empresa = empresa.value;
    this.json.id_empresa = event.option.value;
    this.autocomplete = [];
  }

  obtenerPuestos(){
    this.puestos = [
      { id_puesto : 1, value : "DOCTOR"},
      { id_puesto : 2, value : "INGENIERO"},
      { id_puesto : 3, value : "MESERO"},
      { id_puesto : 4, value : "VENDEDOR"},
      { id_puesto : 5, value : "CAJA"},
      { id_puesto : 6, value : "MESERO PATIO"},
    ]
  }

  selectPuesto(event : any, index : number){
    this.json.detalle[index].id_puesto = event.option.value;
    let puesto = this.puestos.filter((element : any) => element.id_puesto == event.option.value)[0];
    this.json.detalle[index].puesto = puesto.value;
    this.autocomplete = [];
  }

  nuevaCotizacion(){
    this.json = {
      "folio": "",
      "cliente": "",
      "fecha": (new Date()).toJSON().slice(0,10),
      "id_empresa": "",
      "empresa" : "",
      "correo": "",
      "detalle" : Array()
    }
  }

  nuevoDetalle() {
    this.json.detalle.push(
      {
        identificador : "",
        id_puesto : "",
        puesto : "",
        fecha_nacimiento : "",
        fecha_ingreso : "",
        sueldo_mensual : "",
        notas : ""
      }
    )
  }

  eliminarDetalle(index : number){
    this.json.detalle.splice(index,1);
  }

  buscarFolio(){
    this.nomina_service.buscarFolio(this.json.folio)
    .subscribe((object : any) => {
      if(object.ok){
        this.json = object.data.busqueda;
        this.datos_cotizacion = object.data.datos_cotizacion;
        this.json.empresa = this.empresas.filter((element : any) => element.id_empresa == object.data.busqueda.id_empresa)[0].value;
        this.texto_folio = "Hemos recuperado correctamente la información del folio ingresado";
        this.class_folio_dos = "";
      }else{
        this.texto_folio = "No hemos encontrado información del folio ingresado";
        this.class_folio_dos = "d-none";
        Swal.fire("Aviso",object.message,"info");
      }
    });
  }

  procesarCotizacion(){
    if(this.json.detalle.length == 0){
      Swal.fire("Aviso","El detalle de la cotización no puede estar vacio","info");
      return;
    }
    if(this.json.cliente == "" && this.json.correo == ""){
      Swal.fire("Aviso","El campo cliente y correo son obligatorios","info");
      return;
    }
    this.nomina_service.procesarCotizacion(this.json)
    .subscribe((object : any) => {
      if(object.ok){
        this.datos_cotizacion = object.data;
        this.json.folio = object.data.folio;
        Swal.fire("Buen trabajo","La cotización se ha procesado correctamente!","success");
        this.texto_folio = "Su cotización se proceso correctamente, puede proceder a visualizarla o descargarla";
        this.class_folio_dos = "";
      }else{
        Swal.fire("Ha ocurrido un error",object.data.message,"success");
      }
    });
  }

  autocompletar(value : string, tipo : string){
    this.autocomplete = [];
    if(tipo == 'puesto'){
      this.puestos.forEach((element : any) => {
        this.autocomplete.push(element);
      });
    }
    if(tipo == 'empresa'){
      this.empresas.forEach((element : any) => {
        this.autocomplete.push(element);
      });
    }
    this.autocomplete = this.filtrar(value);
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }
  
  private filtrar(value : string){
    let valor_formateado = value.toLowerCase();
    return this.autocomplete.filter((data : any) => data.value.toLowerCase().includes(valor_formateado));
  }
}
