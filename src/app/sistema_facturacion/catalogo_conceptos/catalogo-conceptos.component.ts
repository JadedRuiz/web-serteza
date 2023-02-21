import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConceptoService } from 'src/app/services/Concepto/Concepto.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-conceptos',
  templateUrl: './catalogo-conceptos.component.html',
  styleUrls: ['./catalogo-conceptos.component.css']
})
export class CatalogoConceptosComponent implements OnInit {

  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Descripcion', "Descuento", 'Iva', "Ieps","Otros","Accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  filterControlEmpresa = new FormControl();
  empresas : any;
  filterControlUnidad = new FormControl();
  unidades : any;
  filterControlServicio = new FormControl();
  servicios : any;
  empresas_busqueda : any;
  id_empresa : any;
  conceptos : any;
  concepto = {
    id_empresa : 0,
    id_concepto : 0,
    descripcion : "",
    id_servicio : 0,
    id_unidad : 0,
    descuento : 0.00,
    iva : 0.00,
    tipo_iva : "T",
    ieps : 0.00,
    tipo_ieps : "T",
    otros : 0.00,
    tipo_otros : "T",
    nombre_otros : "",
    usuario_creacion : this.usuario
  };
  band_otros = false;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  tipo_modal = 0;

  constructor(
    private empresa_service: EmpresaService,
    private modalService: NgbModal,
    private concepto_service : ConceptoService
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
        this.mostrarConceptos(object.data[0].id_empresa);
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
    this.mostrarConceptos(value.option.id);
  }

  mostrarConceptos(id_empresa : any){
    this.dataSource.data = [];
    this.concepto_service.facObtenerConceptosEmpresa(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  mostrarServiciosSat(palabra : any){
    let json = {
      palabra : palabra
    };
    this.concepto_service.facServiciosAutocomplete(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.servicios = object.data;
      }
    });
  }

  buscarServicio(){
    this.mostrarServiciosSat(this.filterControlServicio.value);
  }

  optionServicio(value : any){
    this.concepto.id_servicio = value.option.id;
  }

  mostrarUnidadesSat(palabra : any){
    let json = {
      palabra : palabra
    };
    this.concepto_service.facUnidadesAutocomplete(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.unidades = object.data;
      }
    });
  }

  buscarUnidades(){
    this.mostrarUnidadesSat(this.filterControlUnidad.value);
  }

  optionUnidad(value : any){
    this.concepto.id_unidad = value.option.id;
  }

  nuevoConcepto(){
    this.limpiarCampos();
    this.mostrarServiciosSat("");
    this.mostrarUnidadesSat("");
    this.tipo_modal = 1;
    this.openModal()
  }

  visualizar(id : any){
    this.limpiarCampos();
    this.concepto_service.facObtenerConceptosPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.mostrarServiciosSat("");
        this.mostrarUnidadesSat("");
        this.tipo_modal = 2;
        let concepto = object.data;
        this.concepto.id_concepto = parseInt(concepto.id_concepto_empresa);
        this.concepto.descripcion = concepto.descripcion;
        this.filterControlServicio.setValue(concepto.servicio);
        this.concepto.id_servicio = concepto.id_ClaveProdServ;
        this.filterControlUnidad.setValue(concepto.unidad);
        this.concepto.id_unidad = concepto.id_UnidadMedida;
        this.concepto.descuento = parseFloat(concepto.descuento);
        this.concepto.iva = parseFloat(concepto.iva);
        this.concepto.tipo_iva = concepto.tipo_iva;
        this.concepto.ieps = parseFloat(concepto.ieps);
        this.concepto.tipo_ieps = concepto.tipo_ieps;
        this.concepto.otros = parseFloat(concepto.otros_imp);
        this.concepto.tipo_otros = concepto.tipo_otros;
        if(this.concepto.otros > 0){
          this.concepto.nombre_otros = concepto.nombre_otros;
          this.band_otros = true;
        }else{
          this.band_otros = false;
        }

        this.openModal();
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  
  altaConcepto(){
    this.concepto.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Seguro que deseas dar de alta este concepto","info",null,1);
  }

  habilitaCampo(){
    if(this.concepto.otros > 0){
      this.band_otros = true;
    }else{
      this.band_otros = false;
    }
  }

  modificarConcepto(){
    this.concepto.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Seguro que deseas modificar este concepto","info",null,2);
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  limpiarCampos(){
    this.filterControlServicio.setValue("");
    this.filterControlUnidad.setValue("");
    this.concepto = {
      id_empresa : 0,
      id_concepto : 0,
      descripcion : "",
      id_servicio : 0,
      id_unidad : 0,
      descuento : 0.00,
      iva : 0.00,
      tipo_iva : "T",
      ieps : 0.00,
      tipo_ieps : "T",
      otros : 0.00,
      tipo_otros : "T",
      nombre_otros : "",
      usuario_creacion : this.usuario
    };
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
          this.concepto_service.facAltaConcepto(this.concepto)
          .subscribe((object : any) => {
            if(object.ok){
              this.cerrarModal();
              this.mostrarConceptos(this.id_empresa);
              Swal.fire("Buen trabajo","El concepto se ha dado de alta correctamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.concepto_service.facModificarConcepto(this.concepto)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarConceptos(this.id_empresa);
              Swal.fire("Buen trabajo","El concepto se ha modificado correctamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
}
