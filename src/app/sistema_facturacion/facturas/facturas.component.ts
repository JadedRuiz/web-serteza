import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';
import { SerieService } from 'src/app/services/Facturacion/Serie.service';
import { COLOR, SERVER_API } from 'src/config/config';
import Swal from 'sweetalert2';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';


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
  displayedColumns: string[] = ['Folio', 'Fecha','Cliente', 'Total', "Observaciones", "Estatus", "Accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  series: any;
  series_busqueda: any;
  busqueda = {
    id_empresa : 0,
    id_cliente : 0
  };
  clientes : any;
  clientes_busqueda : any;
  filterControlCliente = new FormControl();

  constructor(
    private empresa_service : EmpresaService,
    private serie_service : SerieService,
    private factura_service : FacturacionService,
    private cliente_service : ClienteService
  ) { }

  ngOnInit(): void {
    this.mostrarEmpresas();
    this.mostrarClientes();
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
        this.mostrarFacturas();
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
    this.mostrarFacturas();
  }

  mostrarClientes(){
    this.clientes = [];
    this.clientes_busqueda = [];
    this.cliente_service.facObtenerClientes(this.cliente_seleccionado)
    .subscribe((object : any) => {
      if(object.ok){
        this.clientes = object.data;
        this.clientes_busqueda = object.data;
      }else{
        this.clientes_busqueda.push({
          id_catclientes : "0",
          nombre : "Aún no se tiene clientes registrados"
        });
      }
    });
  }

  buscarCliente(){
    this.clientes_busqueda = [];
    this.clientes.forEach((element : any) => {
      this.clientes_busqueda.push({
        "nombre" : element.nombre,
        "id_catclientes" : element.id_catclientes
      });
    });
    if(this.filterControlCliente.value.length > 0){
      this.clientes_busqueda = [];
      this.clientes.forEach((element : any) => {
        if(element.nombre.includes(this.filterControlCliente.value.toUpperCase())){ 
          this.clientes_busqueda.push({
            "nombre" : element.nombre,
            "id_catclientes" : element.id_catclientes
          });
        }
      });
    }
  }

  optionCliente(value : any){
    this.busqueda.id_cliente = value.option.id;
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

  

  enviarCorreo(id : any){
      Loading.standard();
      this.factura_service.facGenerarFactura(id,4,0)
      .subscribe((object : any) => {
        if(object.ok){
          Loading.remove();
          Swal.fire("Buen trabajo","El correo ha sido re-enviado con exito","success");
        }else{
          Loading.remove();
          Swal.fire("Ha ocurrido un error",object.message,"error");
        }
      });
    }
}
