import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/models/Direccion';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { SerieService } from 'src/app/services/Facturacion/Serie.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-series',
  templateUrl: './catalogo_series.component.html',
  styleUrls: ['./catalogo_series.component.css']
})
export class CatalogoSeriesComponent implements OnInit {

  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Nombre', "Direccion","Accion"];
  public direccion = new Direccion(0,"","","","","","","","","","","");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  id_empresa = 0;
  public modal : any;  
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  serie = {
    id_serie : 0,
    id_empresa : 0,
    serie : "",
    direccion : this.direccion,
    usuario_creacion : this.usuario
  };
  tipo_modal = 0;

  constructor(
    private empresa_service: EmpresaService,
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private serie_service : SerieService
  ) { }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }

  mostrarEmpresas(){
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.cliente_seleccionado)
    .subscribe((object : any) => {
      if(object.ok){
        this.id_empresa = object.data[0].id_empresa;
        this.empresas = object.data;
        this.empresas_busqueda = object.data;
        this.filterControlEmpresa.setValue(object.data[0].empresa);
        this.mostrarSeries(object.data[0].id_empresa);
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
    this.id_empresa = value.option.id;
    this.mostrarSeries(value.option.id);
  }
  
  mostrarSeries(id_empresa : any){
    this.dataSource.data = [];
    this.serie_service.obtenerSeries(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
      }
    });
  }

  mostrarEstado(){
    this.estados_busqueda = [];
    this.estados = [];
    this.compartido_service.obtenerCatalogo("gen_cat_estados")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.estados_busqueda = object;
        this.estados = object;
      }
    });
  }

  buscarEstado(){
    this.estados_busqueda = [];
    this.estados.forEach((element : any) => {
      this.estados_busqueda.push({
        "estado" : element.estado,
        "id_estado" : element.id_estado
      });
    });
    if(this.filterControlEstado.value.length > 0){
      this.estados_busqueda = [];
      this.estados.forEach((element : any) => {
        if(element.estado.includes(this.filterControlEstado.value.toUpperCase())){ 
          this.estados_busqueda.push({
            "estado" : element.estado,
            "id_estado" : element.id_estado
          })
        }
      });
    }
  }

  optionEstado(value : any){
    this.serie.direccion.estado = value.option.id;
  }

  nuevaSerie(){
    this.limpiarCampos();
    this.mostrarEstado();
    this.tipo_modal = 1;
    this.openModal();
  }
  
  altaSerie(){
    this.serie.id_empresa = this.id_empresa;
    this.confirmar("Confirmacion","¿Seguro que deseas dar de alta está serie?","info",null,1);
  }

  visualizar(id : any){
    this.limpiarCampos();
    this.tipo_modal = 2;
    this.serie_service.obtenerSeriePorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        let serie = object.data;
        this.serie.id_serie = serie.id_serie;
        this.serie.serie = serie.serie;
        this.serie.direccion.id_direccion = serie.id_direccion;
        this.serie.direccion.calle = serie.calle;
        this.serie.direccion.numero_exterior = serie.numero_exterior;
        this.serie.direccion.numero_interior = serie.numero_interior;
        this.serie.direccion.cruzamiento_uno = serie.cruzamiento_uno;
        this.serie.direccion.colonia = serie.colonia;
        this.serie.direccion.codigo_postal = serie.codigo_postal;
        this.filterControlEstado.setValue(serie.estado);
        this.serie.direccion.estado = serie.id_estado;
        this.serie.direccion.localidad = serie.localidad;
        this.serie.direccion.municipio = serie.municipio;
        this.serie.direccion.descripcion = serie.descripcion;
        this.openModal();
      }
    });
  }

  modificarSerie(){
    this.serie.id_empresa = this.id_empresa;
    this.confirmar("Confirmacion","¿Seguro que deseas modificar está serie?","info",null,2);
  }

  limpiarCampos(){
    this.direccion = new Direccion(0,"","","","","","","","","","","");
    this.serie = {
      id_serie : 0,
      id_empresa : 0,
      serie : "",
      direccion : this.direccion,
      usuario_creacion : this.usuario
    }
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
        if(tipo == 1){
          this.serie_service.altaSerie(this.serie)
          .subscribe((object : any) => {
            if(object.ok){
              this.cerrarModal();
              this.mostrarSeries(this.id_empresa);
              Swal.fire("Buen trabajo","La serie ha sido dada de alta","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.serie_service.modificarSerie(this.serie)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarSeries(this.id_empresa);
              Swal.fire("Buen trabajo","La serie ha sido modificada","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
}
