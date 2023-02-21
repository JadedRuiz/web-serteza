import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { ConceptoService } from 'src/app/services/Concepto/Concepto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-concepto',
  templateUrl: './catalogo_concepto.component.html',
  styleUrls: ['./catalogo_concepto.component.css']
})
export class CatalogoConceptoComponent implements OnInit {

  public taken = 5;
  public status = -1;
  myControl = new FormControl();
  myControlConcepto = new FormControl();
  public conceptos : any;
  public conceptos_busqueda : any;
  public cat_conceptos : any;
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public conceptos_sat : any;
  public modal : any;
  public id_empresa = parseInt(window.sessionStorage["empresa"]);
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public concepto = {
    id_concepto : 0,
    id_empresa : this.id_empresa,
    tipo_concepto_sat : 0,
    tipo_concepto : 0,
    tipo : "",
    concepto : "",
    unidades : false,
    importe : false,
    saldo : false,
    incrementable : false,
    automatico : false,
    imprimir : false,
    impuesto_estatal : false,
    especie : false,
    parametro_uno : 0.00,
    parametro_dos : 0.00,
    cuenta_contable : "0",
    imprime : false,
    usuario : this.usuario_logueado
  };
  public tipo_modal = 1;
  public band_sat = true;
  public tipo_concept = "";

  constructor(
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private concepto_service : ConceptoService
    ) { }

  ngOnInit(): void {
    this.mostrarConceptos();
  }

  mostrarConceptos(){
    this.conceptos = [];
    this.concepto_service.obtenerConcpetosPorId(this.id_empresa)
    .subscribe( (object : any) => {
      if(object.ok){
        this.conceptos = object.data;
      }
    });
  }
  
  mostrarConceptosSat(tipo : any){
    this.conceptos_sat = [];
    this.compartido_service.obtenerCatalogo("sat_conceptossat")
    .subscribe( (object : any) => {
      if(object.length > 0){
        object.forEach( (element : any) => {
          if(element.tipo == tipo || element.tipo == "O"){
            this.conceptos_sat.push(element);
          }
        });
      }
    });
  }

  mostrarCatalogoConceptos(){
    this.compartido_service.obtenerCatalogo("nom_tipoconceptos")
    .subscribe( (object : any) => {
      if(object.length > 0){
        this.cat_conceptos = object;
      }
    })
  }

  mostrarTipos(event : any){
    this.band_sat = false;
    this.myControlConcepto.reset('');
    this.conceptos_sat = [];
    switch(event.value){
      case "1" : 
      this.tipo_concept = "P";
      break;
      case "2" : 
      this.tipo_concept = "D";
      break;
    }
  }

  guardar(){
    this.tipo_modal = 1;
    this.tipo_concept = "";
    this.limpiar();
    this.mostrarCatalogoConceptos();
    this.openModal();
  }

  guardarConcepto(){
    this.confirmar("Confirmación","¿Deseas guardar el concepto?","info",null,1);
  }

  editar(id : any){
    this.tipo_modal = 2;
    this.concepto_service.obtenerConcpetosPorIdConcepto(id)
    .subscribe( (object : any) => {
      if(object.ok){
          this.concepto.id_concepto = id;
          this.mostrarCatalogoConceptos();
          this.band_sat = false;
          this.concepto.tipo_concepto_sat = object.data.id_conceptosat;
          this.concepto.tipo_concepto = object.data.id_tipoconcepto;
          this.concepto.tipo = object.data.tipo;
          switch(object.data.tipo){
            case "1" : 
            this.mostrarConceptosSat("P");
            break;
            case "2" : 
            this.mostrarConceptosSat("D");
            break;
          }
          this.concepto.concepto = object.data.concepto;
          this.concepto.unidades = object.data.utiliza_unidade;
          this.concepto.importe = object.data.utiliza_importe;
          this.concepto.saldo = object.data.utiliza_saldo;
          this.concepto.incrementable = object.data.seincrementa;
          this.concepto.automatico = object.data.automatico;
          this.concepto.imprimir = object.data.imprimir;
          this.concepto.impuesto_estatal = object.data.impuesto_estatal;
          this.concepto.especie = object.data.especie;
          this.concepto.parametro_uno = object.data.parametro1;
          this.concepto.parametro_dos = object.data.parametro2;
          this.concepto.cuenta_contable = object.data.cuentacontable;
        this.openModal();
      }
    });
  }

  editarConcepto(){
    this.confirmar("Confirmación","¿Seguro que deseas modificar el concepto?","info",null,2);
  }

  eliminar(id : any){
    this.confirmar("Confirmación","¿Seguro que deseas eliminar el concepto?","info",id,3);
  }

  busqueda(value : any){
    this.conceptos_busqueda = [];
    let json = {
      id_empresa : this.id_empresa,
      palabra : value
    };
    this.concepto_service.autocomplete(json)
    .subscribe( (object : any) => {
      if(object.ok){
        this.conceptos_busqueda = object.data;
      }
    });
  }

  busquedaConcepto(value : any){
    this.conceptos_sat = [];
    if(value.length > 2){
      let json = {
        nombre_tabla : "sat_conceptossat",
        nombre_columna : "conceptosat",
        busqueda : value,
        select : ["conceptosat","id_conceptosat"],
        filtros : [
          {
            tipo : "whereIn",
            columna : "tipo",
            datos : [this.tipo_concept,"O"]
          }
        ]
      }
      this.compartido_service.obtenerCatalogoAutoComplete(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.conceptos_sat = object.data;
        }
      });
    }
  }

  setTipoConcepto(event : any){
    this.concepto.tipo_concepto_sat = event.option.id;
  }

  getConcepto(event : any){
    this.editar(event.option.id);
    this.conceptos_busqueda = [];
    this.myControl.reset('');
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
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
          this.concepto_service.crearConcepto(this.concepto)
          .subscribe( (object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","El concepto se ha guardado éxitosamente","success");
              this.cerrarModal();
              this.mostrarConceptos();
            }
          });
        }
        if(tipo == 2){  //Editar
          this.concepto_service.modificarConcepto(this.concepto)
          .subscribe( (object : any) =>{
            if(object.ok){
              Swal.fire("Buen trabajo","El concepto se ha modificado éxitosamente","success");
              this.cerrarModal();
              this.mostrarConceptos();
            }
          })
        }
        if(tipo == 3){  //Eliminar
          this.concepto_service.cambiarActivo(json,0)
          .subscribe( (object : any) =>{
            if(object.ok){
              Swal.fire("Buen trabajo","El concepto se ha eliminado éxitosamente","success");
              this.mostrarConceptos();
            }
          })
        }
      }
    });
  }
  limpiar(){
    this.conceptos_sat = [];
    this.concepto = {
      id_concepto : 0,
      id_empresa : this.id_empresa,
      tipo_concepto_sat : 0,
      tipo_concepto : 0,
      tipo : "",
      concepto : "",
      unidades : false,
      importe : false,
      saldo : false,
      incrementable : false,
      automatico : false,
      imprimir : false,
      impuesto_estatal : false,
      especie : false,
      parametro_uno : 0.00,
      parametro_dos : 0.00,
      cuenta_contable : "0",
      imprime : false,
      usuario : this.usuario_logueado
    };
    this.tipo_modal = 1;
    this.band_sat = true;
    this.myControl.reset('');
  }
}
