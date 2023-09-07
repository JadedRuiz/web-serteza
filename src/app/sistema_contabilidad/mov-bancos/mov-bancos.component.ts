import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import { DashboardService } from 'src/app/services/Dashboard/Dashboard.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mov-bancos',
  templateUrl: './mov-bancos.component.html',
  styleUrls: ['./mov-bancos.component.css']
})
export class MovBancosComponent implements OnInit {

  public ejercicio : any;
  public meses : any;
  public periodos : any;
  public ejercicioBuscado : any;
  public mesesBuscado : any;
  public periodosBuscados : any;
  public resultados: any;
  public totales: any;
  public anio = new Date().getFullYear();
  public ejercicioActual   = new Date().getFullYear();
  public mesActual = new Date().getMonth();
  public desMes : any;
  public periodoActual = 0;
  contador = 0;
  formattedAmount : any;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public modal_alta = {
    titulo : "Alta movimiento",
    formulario : {
      conceptos : Array(),
      concepto_selec : '',
      fecha : {
        min_date : new Date(),
        max_date : new Date(),
        resu : new Date()
      },
      importe : '',
      beneficiarios : Array(),
      beneficiario_selec : '',
    },
    respueta : Object
  };
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  id_empresa = 0;

  constructor(
    private modalService: NgbModal,
    private dashboard_sv : DashboardService,
    private nomina_service: NominaService,
    private contabilidad_service : ContabilidadService,
    private currencyPipe : CurrencyPipe,
    private empresa_service: EmpresaService
  ) { }

  ngOnInit(): void {
    this.cargaPrincipal();
  }

  cargarModal(content : any){
    this.modal_alta.formulario.importe = "";
    this.modal_alta.formulario.fecha.resu = new Date(this.ejercicioActual+'/'+this.mesActual+'/01');
    this.modal_alta.formulario.fecha.min_date = new Date(this.ejercicioActual+'/'+this.mesActual+'/01');
    this.modal_alta.formulario.fecha.max_date = new Date(this.ejercicioActual+'/'+this.mesActual+'/'+ (new Date(this.ejercicioActual+'/'+this.mesActual+'/0').getDate()));
    this.conceptoAutoComplete("");
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size : 'lg', keyboard : false, centered : true, backdrop : 'static' });
  }
  cargaPrincipal(){
    this.ejercicios();
    this.Meses();
    this.mostrarEmpresas();
  }
  transformAmount(element : any){
    try {
      this.formattedAmount = this.currencyPipe.transform(element.target.value, '$');
    } catch (error) {
      this.modal_alta.formulario.importe = "";
      Swal.fire('Aviso','Solo se permiten números','info');
    }

    element.target.value = this.formattedAmount;
}
  //#region [Carga principal - Catalogos]
    mostrarEmpresas(){
      this.empresas_busqueda = [];
      this.empresas = [];
      this.empresa_service.obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
      .subscribe((object : any) => {
        if(object.ok){
          this.empresas = object.data;
          this.empresas_busqueda = object.data;
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
      this.id_empresa =  value.option.id;
    }
    ejercicios(){
      this.ejercicio = [];
      this.contador = 1;
      for(let i=(this.anio-5);i<=this.anio;i++){
        this.ejercicio.push({
          "id" : this.contador,
          "ejercicio" : i
        });
        this.contador = this.contador + 1;
      }
      // this.ejercicioActual = this.contador - 1;
      this.ejercicioBuscado = this.ejercicio;
    }
    
    Meses(){
      this.dashboard_sv.obtenerMeses()
      .subscribe((object : any) => {
        if(object.ok){
          this.meses = object.data;
          this.mesesBuscado = object.data;
          this.desMes = this.meses[this.mesActual+1].mes;
          this.meses[this.mesActual+1].id = this.mesActual+1;
          this.periodosMensual();
        }
      });
    }
    periodosMensual(){
      let json = {
        id_empresa : 78,
        ejercicio : this.ejercicioActual,
        mes : this.mesActual
      };

      this.nomina_service.periodosPorMes(json)
      .subscribe((object : any) => {
        if(object.ok){

          this.periodos = object.data;

        }
      });
    }
    mesSeleccionado(MesSel:any){
      this.mesActual = MesSel;
      this.periodosMensual();
    }
    ejercicioSeleccionado(EjercicioSel:any){
      console.log(EjercicioSel.value);
        this.ejercicioActual = EjercicioSel.value;
    }
    periodoSeleccionado(PeriodoSel:any){
        this.periodoActual = PeriodoSel;
    }
    conceptoAutoComplete(palabra : string){
      this.contabilidad_service.conceptoAutoComplete({
        id_empresa : this.id_empresa,
        palabra : palabra
      }).subscribe((res : any) => {
        if(res.ok){
          this.modal_alta.formulario.conceptos = res.data;
        }
      });
    }
  //#endregion
  //#region [Eventos modal_alta]
    conceptoSeleccionado(event : any){

    }
    beneficiarioSeleccionado(event : any){

    }
  //#endregion
}
