import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';
import { SerieService } from 'src/app/services/Facturacion/Serie.service';
import { COLOR, SERVER_API } from 'src/config/config';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  
  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  empresas_busqueda: any;
  filterControlEmpresa = new FormControl();
  filterControlSerie = new FormControl();
  empresas: any;
  displayedColumns: string[] = ['Folio', 'Fecha','Status', 'Total', "Observaciones", "Accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  series: any;
  series_busqueda: any;
  busqueda = {
    id_empresa : 0,
    id_serie : 0
  };

  constructor(
    private empresa_service : EmpresaService,
    private serie_service : SerieService,
    private factura_service : FacturacionService
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
        this.empresas = object.data;
        this.busqueda.id_empresa = object.data[0].id_empresa;
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
    this.busqueda.id_empresa = value.option.id;
    this.mostrarSeries(value.option.id);
    this.mostrarFacturas();
  }
  
  mostrarSeries(id_empresa : any){
    this.series = [];
    this.series_busqueda = [];
    this.serie_service.obtenerSeries(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.series = object.data;
        this.series_busqueda = object.data;
        this.filterControlSerie.setValue(object.data[0].serie);
        this.busqueda.id_serie = object.data[0].id_serie;
        this.mostrarFacturas();
      }else{
        this.filterControlSerie.setValue("Sin series");
      }
    });
  }

  buscarSerie(){
    this.series_busqueda = [];
    this.series.forEach((element : any) => {
      this.series_busqueda.push({
        "serie" : element.serie,
        "id_serie" : element.id_serie
      });
    });
    if(this.filterControlEmpresa.value.length > 0){
      this.series_busqueda = [];
      this.series.forEach((element : any) => {
        if(element.serie.includes(this.filterControlEmpresa.value.toUpperCase())){ 
          this.series_busqueda.push({
            "serie" : element.serie,
            "id_serie" : element.id_serie
          })
        }
      });
    }
  }

  optionSerie(value : any){
    this.busqueda.id_serie = value.option.id;
    this.mostrarFacturas();
  }

  mostrarFacturas(){
    this.dataSource.data = [];
    
    this.factura_service.facObtenerFacturas(this.busqueda)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  descargar(id_factura : number, tipo : number){
    if(tipo ==2){
      location.href = SERVER_API+"reporte/generarFactura/"+id_factura+"/"+tipo+"/2";
    }
    if(tipo == 1){
      this.factura_service.facGenerarFactura(id_factura, tipo, 1)
      .subscribe((object : any) => {
        if(object.ok){
          //DESCARGA PDF
          var byteCharacters = atob(object.data);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var file = new Blob([byteArray], { type: 'application/pdf;base64'});
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      })
    }
  }
}
