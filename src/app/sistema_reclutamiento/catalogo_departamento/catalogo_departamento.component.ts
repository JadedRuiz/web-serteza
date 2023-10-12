 import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import { Departamento } from 'src/app/models/Departamento';
import { Puesto } from 'src/app/models/Puesto';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormControl} from '@angular/forms';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DepartamentoService } from 'src/app/services/Reclutamiento/Departamento.service';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { ReporteService } from 'src/app/services/Reclutamiento/Reporte.service';

@Component({
  selector: 'app-catalogo-departamento',
  templateUrl: './catalogo_departamento.component.html'
})
export class CatalogoDepartamentoComponent implements OnInit {

  //Variables config
  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  //Modelo tabla
  displayedColumns: string[] = ['id_departamento', 'departamento', "estatus", 'autorizados', 'vacantes', "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  //Buscador
  filterControlDepartamento = new FormControl();
  filterControlEmpresa = new FormControl();
  departamentos_busqueda : any;
  departamentos : any;
  empresas : any;
  empresas_busqueda : any;
  busqueda = {
    id_cliente : this.cliente_seleccionado,
    id_empresa : null
  };
  //Tipo_modal
  tipo_modal = 1;
  tipo_modal_puesto = 1;
  //Variables
  autorizados = 0;
  vacantes = 0;
  public departamento = new Departamento(0,0,"","",1,this.usuario,1,[]);
  public puesto = new Puesto(0,0,"","","","",false,"1","",this.usuario,1);
  public modal : any;
  public modal_puesto : any;
  public puesto_seleccionado = 0;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('content_puesto', {static: false}) contenidoDelModalPuesto : any;
  //Autocomplete

  constructor(
    // private departamento_service : DepartamentoService,
    private modalService: NgbModal,
    private departamento_service : DepartamentoService,
    private puesto_service : PuestoService,
    private empresa_service : EmpresaService,
    private currencyPipe : CurrencyPipe,
    private reporte_service : ReporteService
  ) {
    this.modal = NgbModalRef;
    this.departamento.puestos = [];
    this.paginator = MatPaginator;
  }

  ngOnInit(): void {
    this.mostrarDepartamentos();
    this.mostrarEmpresas();
  }
  transformAmount(element : any, tipo : number){
    if(tipo == 1){
      this.puesto.sueldo_tipo_a = this.currencyPipe.transform(this.puesto.sueldo_tipo_a, '$');
      element.target.value = this.puesto.sueldo_tipo_a;
    }
    if(tipo == 2){
      this.puesto.sueldo_tipo_b = this.currencyPipe.transform(this.puesto.sueldo_tipo_b, '$');
      element.target.value = this.puesto.sueldo_tipo_b;
    }
    if(tipo == 3){
      this.puesto.sueldo_tipo_c = this.currencyPipe.transform(this.puesto.sueldo_tipo_c, '$');
      element.target.value = this.puesto.sueldo_tipo_c;
    }
  }

  mostrarDepartamentos(){
    this.departamentos_busqueda = [];
    this.departamento_service.obtenerDepartamentosPorIdCliente(this.busqueda)
    .subscribe((object : any) => {
      this.dataSource.data = object.data;
      this.dataSource.paginator = this.paginator;
      this.departamentos_busqueda = object.data;
      this.departamentos = object.data;
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
    this.editar(value.option.id);
  }

  mostrarEmpresas(){
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
    .subscribe((object : any) => {
      if(object.ok){
        this.empresas = object.data;
        this.empresas_busqueda = object.data;
        this.busqueda.id_empresa = object.data[0].id_empresa;
        this.filterControlEmpresa.setValue(object.data[0].empresa);
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
    this.busqueda.id_empresa = value.option.id;
    this.mostrarDepartamentos();
  }

  nuevoDepartamento(){
    this.tipo_modal = 1;
    this.limpiarCampos();
    this.openModal(1);
  }

  altaDepartamento(){
    if(this.departamento.departamento != ""){
      this.departamento.id_empresa = parseInt(this.busqueda.id_empresa+"");
      this.confirmar("Confirmación","¿Seguro que deseas dar de alta este departamento?","info",1,null);
    }else{
      Swal.fire("Aviso","El nombre del departamento no puede ser vacio","info");
    }
  }

  editar(id : number){
    this.tipo_modal = 2;
    this.departamento_service.obtenerDepartamentoPorId(id)
    .subscribe((object : any) => {
      this.departamento.id_departamento = object.data.id_departamento;
      this.autorizados =  object.data.autorizados;
      this.vacantes =  object.data.vacantes;
      this.departamento.departamento = object.data.departamento;
      this.departamento.descripcion = object.data.descripcion;
      this.departamento.puestos = object.data.puestos;
      this.resetearAutorizados();
      this.openModal(1);
    });
  }

  modificarDepartamento(){
    this.confirmar("Confirmación","¿Seguro que deseas editar el departamento?","info",2,null);
  }

  nuevoPuesto(){
    this.openModal(2);
    this.puesto = new Puesto(0,0,"","","","",false,"1","",this.usuario,1);
    this.tipo_modal_puesto = 1;
  }

  agregarPuesto(){
    if(this.puesto.puesto != ""){
      if(this.puesto.autorizados != "0"){
        this.puesto.id_arreglo = this.departamento.puestos.length + 1;
        this.puesto.puesto = this.puesto.puesto.toUpperCase();
        this.puesto.descripcion = this.puesto.descripcion.toUpperCase();
        this.departamento.puestos.push(this.puesto);
        this.cerrarModal(2);
        this.resetearAutorizados();
      }else{
        Swal.fire("Aviso","El valor del campo autorizados debe ser mayor a 0","info");
      }
    }else{
      Swal.fire("Aviso","El nombre del puesto no puede ser vacio","info");
    }
  }

  editarPuesto(id_arreglo : number){
    this.departamento.puestos.forEach((element : Puesto) => {
      if(element.id_arreglo == id_arreglo){
        this.puesto = element;
        this.tipo_modal_puesto = 2;
        this.openModal(2);
        this.puesto_seleccionado = id_arreglo;
      }
    });
  }

  modificarPuesto(){
    this.puesto.puesto = this.puesto.puesto.toUpperCase();
    this.puesto.descripcion = this.puesto.descripcion.toUpperCase();
    this.cerrarModal(2);
    this.resetearAutorizados();
  }

  eliminarPuesto(id_arreglo : number){
    this.departamento.puestos.forEach((element : Puesto, indice : number) => {
      if(element.id_arreglo == id_arreglo){
        this.confirmar("Confirmación","¿Seguro que deseas eliminar el puesto?","success",3,{
          indice : indice,
          id : element.id_puesto
        });
      }
    });
    this.resetearAutorizados();
  }

  resetearAutorizados(){
    this.autorizados = 0;
    this.departamento.puestos.forEach((element : Puesto) => {
      this.autorizados += parseInt(element.autorizados+"");
    });
  }

  limpiarCampos(){
    this.departamento.puestos = [];
    this.departamento = new Departamento(0,0,"","",1,this.usuario,1,[]);
    this.autorizados = 0;
    this.vacantes = 0;
  }

  descagar(id_empresa : any){
    this.reporte_service.reporteDepartamento(id_empresa,this.cliente_seleccionado)
    .subscribe((object : any) => {
      let win = window.open("","_blank");
      let html = '';
      html += '<html>';
      html += '<body style="margin:0!important">';
      html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data+'" type="application/pdf" />';
      html += '</body>';
      html += '</html>';
      win?.document.write(html);
    });
  }

  openModal(tipo :number) {
    if(tipo == 1){
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modal_puesto = this.modalService.open(this.contenidoDelModalPuesto,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : number){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modal_puesto.close();
    }
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number,dato : any){
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
          this.departamento_service.altaDepartamento(this.departamento)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","El departamento ha sido dado de alta","success");
              this.mostrarDepartamentos();
              this.cerrarModal(1);
            }
          });
        }
        if(tipo == 2){  //Editar
          this.departamento_service.modificarDepartamento(this.departamento)
          .subscribe((object : any) => {
            if(object.ok){
              if(object.data.tipo == 1){
                let error = "";
                object.data.data.forEach((element : any) => {
                  error += element+"\n";
                });
                this.cerrarModal(1);
                this.mostrarDepartamentos();
                Swal.fire("Aviso",error,"info");
              }
              if(object.data.tipo == 2){
                this.cerrarModal(1);
                this.mostrarDepartamentos();
                Swal.fire("Buen trabajo","Se ha actualizado el departamento","success");
              }
            }
          });
        }
        if(tipo == 3){
          this.departamento.puestos.splice(dato.indice,1);
          if(this.tipo_modal == 2){
            this.departamento_service.eliminarPuesto(dato.id)
            .subscribe((object : any) => {
              if(object.ok){
                Swal.fire("Buen trabajo","Se ha eliminado el puesto","success");
              }
            });
          }else{
            Swal.fire("Buen trabajo","Se ha eliminado el puesto","success");
          }
        }
      }
    });
  }
}
