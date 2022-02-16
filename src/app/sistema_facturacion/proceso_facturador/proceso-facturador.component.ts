import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'path';
import { element } from 'protractor';
import { Direccion } from 'src/app/models/Direccion';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { ConceptoService } from 'src/app/services/Concepto/Concepto.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';
import { SerieService } from 'src/app/services/Facturacion/Serie.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proceso-facturador',
  templateUrl: './proceso-facturador.component.html',
  styleUrls: ['./proceso-facturador.component.css']
})
export class ProcesoFacturadorComponent implements OnInit {

  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public direccion = new Direccion(0,"","","","","","","","","","","");
  filterControlEmpresa = new FormControl();
  filterControlCliente = new FormControl();
  serieControl = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  conceptos : any;
  series : any;
  formas_pago : any;
  metodos_pago : any;
  monedas : any;
  usoCFDIS : any;
  tipo_comprobante : any;
  id_empresa = 0;
  displayedColumns: string[] = ['Descripcion', 'Cantidad', 'Precio', "Total", "Accion"];
  displayedColumnsUbicaciones: string[] = ['Lugar', 'Tipo', 'Ide', "Distancia", "Fecha", "Accion"];
  dataSource  = new MatTableDataSource();
  UbicaionSource  = new MatTableDataSource();
  @ViewChild(MatTable) table: any;
  band_ine = false;
  band_ = false;
  datos_factura = {
    folio : 0,
    id_serie : "",
    id_empresa : 0,
    id_cliente : 0,
    id_formapago : "",
    id_metodopago : "",
    id_tipomoneda : 100,
    id_usocfdi : 3,
    numero_cuenta : "",
    tipo_comprobante : "2",
    tipo_cambio : "0",
    condiciones : "CONTADO/CREDITO",
    observaciones : "",
    usa_ine : this.band_ine,
    usa_cataporte : this.band_,
    conceptos : this.dataSource.data,
    subtotal : "0.00",
    descuento_t : "0.00",
    iva_t : "0.00",
    ieps_t : "0.00",
    otros_t : "0.00",
    total : "0.00",
    usuario_creacion : this.usuario
  };
  datos_ubicacion = {
    "id_row" : 0,
    "tipo" : "",
    "rfc" : "",
    "Ide" : "",
    "Propietario" : "",
    "Distancia" : 0,
    "Fecha" : "",
    "active" : true
  };
  datos_transporte = {
    placa : "",
    anio : "",
    permiso : "",
    config : "",
    num_permiso : "",
    info_seguro : {
      resp_civil : {
        aseguradora : "",
        poliza : ""
      },
      medio_ambiente : {
        aseguradora : "",
        poliza : ""
      },
      carga : {
        aseguradora : "",
        poliza : ""
      },
      prima_seguro : ""
    },
    remolques : []
  };
  mostrarDatos = true;
  band_view = false;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('ubicacion', {static: false}) contenidoDelModalUbicacion : any;
  @ViewChild('transporte', {static: false}) contenidoDelModalTransporte : any;
  @ViewChild('operador', {static: false}) contenidoDelModalOperador : any;
  cliente = {
    id_cliente : 0,
    razon_social : "",
    rfc : "",
    curp : "",
    telefono : "",
    mail : "",
    direccion : this.direccion,
    usuario_creacion : this.usuario
  };
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  clientes : any;
  clientes_busqueda : any;
  tipo_modal = 0;
  band_button = true;
  selectedTab = 0;
  modalUbicacion: any;
  modalTransporte: any;
  modalOperador: any;

  constructor(
    private empresa_service: EmpresaService,
    private concepto_service : ConceptoService,
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService,
    private serie_service : SerieService,
    private factura_service : FacturacionService
  ) { }

  ngOnInit(): void {
    this.mostrarEmpresas();
    this.mostrarClientes();
    this.mostrarCatalogos();
    this.UbicaionSource.data.push({
      "id_row" : 0,
      "tipo" : "Origen",
      "Ide" : "OR0001",
      "Propietario" : "",
      "Distancia" : 0,
      "FechaSalida" : "",
      "FechaLLegada" : "",
      "active" : true
    });
    this.dataSource.data.push({
      id_row : 0,
      id_concepto : 0,
      descripcion : "",
      cantidad : "1",
      precio : "0.00",
      unidad : "",
      descuento_porcent : 0,
      descuento : "0.00",
      iva_porcent : 0,
      iva : "0.00",
      ieps : "0.00",
      ieps_porcent : 0,
      otros : "0.00",
      otro_porcent : 0,
      importe : "0.00",
      neto : "0.00",
      neto_print : "",
      btn : false
    });
  }
  
  mostrarCatalogos(){
    this.formas_pago = [];
    this.metodos_pago = [];
    this.monedas = [];
    this.usoCFDIS = [];
    this.tipo_comprobante = [];
    this.compartido_service.obtenerCatalogo("sat_FormaPago")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.formas_pago = object;
        this.datos_factura.id_formapago = object[0].id_formapago;
      }
    });
    this.compartido_service.obtenerCatalogo("sat_MetodoPago")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.metodos_pago = object;
        this.datos_factura.id_metodopago = object[0].id_metodopago;
      }
    });
    this.compartido_service.obtenerCatalogo("sat_CatMoneda")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.monedas = object;
      }
    });
    this.compartido_service.obtenerCatalogo("sat_UsoCFDI")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.usoCFDIS = object;
      }
    });
    this.compartido_service.obtenerCatalogo("sat_TipoComprobante")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.tipo_comprobante = object;
        this.datos_factura.tipo_comprobante = object[0].id_tipocomprobante;
      }
    });
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
        this.mostrarSeries(object.data[0].id_empresa);
        this.obtenerFolio(object.data[0].id_empresa);
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
  }

  obtenerFolio(id_empresa : any){
    this.factura_service.facObtenerFolio(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.datos_factura.folio = parseInt(object.data.folio)+1;
      }
    })
  }

  mostrarClientes(){
    this.clientes = [];
    this.clientes_busqueda = [];
    this.cliente_service.facObtenerClientes()
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
        if(element.empresa.includes(this.filterControlCliente.value.toUpperCase())){ 
          this.clientes_busqueda.push({
            "nombre" : element.nombre,
            "id_catclientes" : element.id_catclientes
          });
        }
      });
    }
  }

  optionCliente(value : any){
    this.datos_factura.id_cliente = value.option.id;
    this.band_view = true;
  }
  
  mostrarCliente(id : any){
    this.limpiarCampos();
    this.tipo_modal = 2;
    this.cliente_service.facObtenerClientesPorId(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.cliente.id_cliente = object.data.id_catclientes;
        this.cliente.razon_social = object.data.razon_social;
        this.cliente.rfc = object.data.rfc;
        this.cliente.curp = object.data.curp;
        this.cliente.telefono = object.data.telefono;
        this.cliente.mail = object.data.email;
        this.cliente.direccion.id_direccion = object.data.id_direccion;
        this.cliente.direccion.calle = object.data.calle;
        this.cliente.direccion.numero_exterior = object.data.numero_exterior;
        this.cliente.direccion.numero_interior = object.data.numero_interior;
        this.cliente.direccion.cruzamiento_uno = object.data.cruzamiento_uno;
        this.cliente.direccion.colonia = object.data.colonia;
        this.cliente.direccion.codigo_postal = object.data.codigo_postal;
        this.filterControlEstado.setValue(object.data.estado);
        this.cliente.direccion.estado = object.data.id_estado;
        this.cliente.direccion.localidad = object.data.localidad;
        this.cliente.direccion.municipio = object.data.municipio;
        this.cliente.direccion.descripcion = object.data.descripcion_direccion;
        this.openModal(1);
      }
    });
  }

  mostrarConceptos(id_empresa : any){
    this.conceptos = [];
    this.concepto_service.facObtenerConceptosEmpresa(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.conceptos = object.data;
      }
    });
  }

  optionConcepto(event : any, id_row : any){
    let concepto : any;
    this.conceptos.forEach((element : any) => {
      if(element.id_concepto_empresa == event.option.id){
        concepto = element;
      }
    });
    this.dataSource.data.forEach((element :any) => {
      if(element.id_row == id_row){
        element.id_concepto = event.option.id;
        element.descuento_porcent = concepto.descuento;
        element.iva_porcent = concepto.iva;
        element.ieps_porcent = concepto.ieps;
        element.otros_porcent = concepto.otros_imp;
      }
    });
    console.log(this.dataSource.data);
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
    this.cliente.direccion.estado = value.option.id;
  }

  mostrarSeries(id_empresa : any){
    this.series = [];
    this.serie_service.obtenerSeries(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.series = object.data;
        this.serieControl.setValue(object.data[0].serie);
        this.datos_factura.id_serie = object.data[0].id_serie;
      }
    });
  }

  nuevaLinea(){
    this.dataSource.data.push({
      id_row : this.dataSource.data.length+1,
      id_concepto : 0,
      descripcion : "",
      cantidad : "1",
      precio : "0.00",
      unidad : "",
      descuento_porcent : 0,
      descuento : "0.00",
      iva_porcent : 0,
      iva : "0.00",
      ieps : "0.00",
      ieps_porcent : 0,
      otros : "0.00",
      otro_porcent : 0,
      importe : "0.00",
      neto : "0.00",
      neto_print : "",
      btn : false
    });
    this.table.renderRows();
  }

  calcularRowTotal(id_row : any){
    const formatter = new Intl.NumberFormat('en-NZ', {
      currency: 'NZD',
      minimumFractionDigits: 2,
    });
    this.dataSource.data.forEach((element : any) => {
      if(element.id_row == id_row){
        let subtotal = parseFloat(element.cantidad) * parseFloat(element.precio);
        element.neto = subtotal;
        element.neto_print = "$ " +formatter.format(subtotal);
        element.descuento = ((parseFloat(element.descuento_porcent) / 100) * subtotal);
        element.iva = ((parseFloat(element.iva_porcent) / 100) * subtotal);
        element.ieps = ((parseFloat(element.ieps_porcent) / 100) * subtotal);
        element.otros = ((parseFloat(element.otros_porcent) / 100) * subtotal);
        this.calcularTotal();
      }
    });
  }

  calcularTotal(){
    let subtotal = 0.00;
    let descuento = 0.00;
    let iva = 0.00;
    let ieps = 0.00;
    let otros = 0.00;
    let total = 0.00;
    this.dataSource.data.forEach((element : any) => {
      subtotal += parseFloat(element.neto);
      total += subtotal;
      descuento += parseFloat(element.descuento);
      total += descuento;
      iva += parseFloat(element.iva);
      total += iva;
      ieps += parseFloat(element.ieps);
      total += ieps;
      otros += parseFloat(element.otros);
      total += otros;
    });
    const formatter = new Intl.NumberFormat('en-NZ', {
      currency: 'NZD',
      minimumFractionDigits: 2,
    });
    this.datos_factura.subtotal = formatter.format(subtotal);
    this.datos_factura.descuento_t = formatter.format(descuento);
    this.datos_factura.iva_t = formatter.format(iva);
    this.datos_factura.ieps_t = formatter.format(ieps);
    this.datos_factura.otros_t = formatter.format(otros);
    this.datos_factura.total = formatter.format(total);
  }
  
  eliminarLinea(id : any){
    this.dataSource.data.forEach((element : any, index : any) => {
      if(element.id_row == id){
        this.dataSource.data.splice(index,1);
        this.calcularTotal();
      }
    });
    this.table.renderRows();
  }

  nuevoCliente(){
    this.limpiarCampos();
    this.mostrarEstado();
    this.tipo_modal = 1;
    this.openModal(1);
  }

  altaCliente(){
    this.confirmar("Confirmación","¿Seguro que desas dar de alta un nuevo cliente?","info",null,1);
  }

  altaFactura(){
    if(this.datos_factura.id_cliente == 0){
      Swal.fire("Aviso","Es necesario seleccionar el cliente receptor para la factura","info");
      return "";
    }
    let band = false;
    this.dataSource.data.forEach((element : any) => {
        if(element.id_concepto == "0"){
          band = true;
        }
    });
    if(band){
      Swal.fire("Aviso","Es necesario seleccionar el concepto","info");
      return "";
    }
    this.datos_factura.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Seguro que deseas guardar está factura?","info",null,3);
    return "";
  }

  nuevaUbicacion(){
    this.openModal(2);
  }

  nuevoTransporte(){
    this.openModal(3);
  }

  nuevoOperador(){ 
    this.openModal(4);
  }

  openModal(tipo : any) {
    if(tipo == 1){
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modalUbicacion = this.modalService.open(this.contenidoDelModalUbicacion,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 3){
      this.modalTransporte = this.modalService.open(this.contenidoDelModalTransporte,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 4){
      this.modalOperador = this.modalService.open(this.contenidoDelModalOperador,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : any){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modalUbicacion.close();
    }
    if(tipo == 3){
      this.modalTransporte.close();
    }
    if(tipo == 4){
      this.modalOperador.close();
    }
  }

  limpiarCampos(){
    this.direccion = new Direccion(0,"","","","","","","","","","","");
    this.cliente = {
      id_cliente : 0,
      razon_social : "",
      rfc : "",
      curp : "",
      telefono : "",
      mail : "",
      direccion : this.direccion,
      usuario_creacion : this.usuario
    };
    this.filterControlEstado.setValue('');
  }
  
  limpiarCamposFactura(){
    this.filterControlCliente.setValue("");
    this.band_ine = false;
    this.band_ = false;
    this.dataSource.data = [];
    this.dataSource.data.push({
      id_row : 0,
      id_concepto : 0,
      descripcion : "",
      cantidad : "1",
      precio : "0.00",
      unidad : "",
      descuento : "0.00",
      iva : "0.00",
      ieps : "0.00",
      otros : "0.00",
      importe : "0.00",
      neto : "0.00",
      btn : false
    });
    this.datos_factura = {
      folio : 0,
      id_serie : "",
      id_empresa : 0,
      id_cliente : 0,
      id_formapago : "",
      id_metodopago : "",
      id_tipomoneda : 100,
      id_usocfdi : 3,
      numero_cuenta : "",
      tipo_comprobante : "2",
      tipo_cambio : "0",
      condiciones : "CONTADO/CREDITO",
      observaciones : "",
      usa_ine : this.band_ine,
      usa_cataporte : this.band_,
      conceptos : this.dataSource.data,
      subtotal : "0.00",
      descuento_t : "0.00",
      iva_t : "0.00",
      ieps_t : "0.00",
      otros_t : "0.00",
      total : "0.00",
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
          this.cliente_service.facAltaCliente(this.cliente)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","El cliente se ha dado de alta correctamente","success");
              this.mostrarClientes();
              this.cerrarModal(1);
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Editar
          
        }
        if(tipo == 3){  //Alta factura
          this.factura_service.facAltaFactura(this.datos_factura)
          .subscribe((object : any) => {
            if(object.ok){
              this.limpiarCamposFactura();
              this.obtenerFolio(this.id_empresa);
              Swal.fire("Buen trabajo","La factura ha sido almacenada correctamente","success");
            }
          });
        }
      }
    });
  }

  changeTab() { 
    this.selectedTab += 1; 
  }

}
