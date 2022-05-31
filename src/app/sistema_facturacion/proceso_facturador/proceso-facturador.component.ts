import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'path';
import { element } from 'protractor';
import { Direccion } from 'src/app/models/Direccion';
import { Operador } from 'src/app/models/Operador';
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
  public ope = new Operador(0,"","","","",this.direccion);
  filterControlEmpresa = new FormControl();
  filterControlCliente = new FormControl();
  filterControlClave = new FormControl();
  filterControlEmbalaje = new FormControl();
  filterControlMonedas = new FormControl();
  serieControl = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  conceptos : any;
  series : any;
  operadores : any;
  transportes : any;
  formas_pago : any;
  metodos_pago : any;
  monedas : any;
  usoCFDIS : any;
  config_transportes : any;
  tipo_permisos : any;
  tipos_remolques : any;
  tipo_comprobante : any;
  id_empresa = 0;
  displayedColumns: string[] = ['Descripcion', 'Cantidad', 'Precio', "Total", "Accion"];
  displayedColumnsUbicaciones: string[] = ['Lugar', 'Tipo', 'Ide', "Distancia", "Fecha", "Accion"];
  displayedColumnsMercancias: string[] = ['Bienes', 'Clave', 'Descripcion', "Peso", "Valor", "Accion"];
  dataSource  = new MatTableDataSource();
  UbicacionSource  = new MatTableDataSource();
  MercanciaSource = new MatTableDataSource();
  @ViewChild(MatTable) table: any;
  tipo_vehiculo = 1;
  datos_ubicacion = {
    id_cliente : this.cliente_seleccionado,
    tipo : "",
    lugar : "",
    rfc : "",
    folio_sat : "",
    nombre : "",
    direccion  : this.direccion
  };
  datos_transporte = {
    tipo_vehiculo : 0,
    id_empresa : 0,
    num_economico : "",
    placa : "",
    anio : "",
    tipo_permiso : "0",
    configuracion : "0",
    num_permiso : "",
    aseguradora_resp_civil : "",
    poliza_resp_civil : "",
    aseguradora_ambiente : "",
    poliza_ambiente : "",
    aseguradora_carga : "",
    poliza_carga : "",
    prima_seguro : ""
  };
  cataporte = {
    ubicaciones : this.UbicacionSource.data,
    transporte : {
      id_operador : 0,
      operador : "",
      id_vehiculo : 0,
      vehiculo : "",
      id_remolque : 0,
      remolque : "",
      id_propietario : 0,
      propietario : ""
    },
    mercancias : []
  };
  mercancias : any;
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
    usa_ine : false,
    usa_cataporte : false,
    cataporte : this.cataporte,
    conceptos : this.dataSource.data,
    subtotal : "0.00",
    descuento_t : "0.00",
    iva_t : "0.00",
    ieps_t : "0.00",
    otros_t : "0.00",
    total : "0.00",
    usuario_creacion : this.usuario
  };
  datos_mercancia = {
    bienes_trans : "",
    clave_prod : "",
    descripcion : "",
    clave_uni : "",
    dimensiones : "",
    cantidad : "",
    unidad : "",
    embalaje : "",
    desc_embalaje : "",
    peso : "",
    meterial_pel : false,
    valor : "",
    moneda : "",
    fraccion_aran : "",
    uuid_ext : ""
  };
  peso_total = 0;
  total = 0;
  mostrarDatos = true;
  band_view = false;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('ubicacion', {static: false}) contenidoDelModalUbicacion : any;
  @ViewChild('transporte', {static: false}) contenidoDelModalTransporte : any;
  @ViewChild('operador', {static: false}) contenidoDelModalOperador : any;
  @ViewChild('mercancia', {static: false}) contenidoDelModalMercancia : any;
  @ViewChild('content_import', {static: false}) modal_excel : any;
  modal_control_excel: any;
  cliente = {
    id_cliente : 0,
    id : this.cliente_seleccionado,
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
  remolques: any;
  ubicaciones : any;
  tipo_persona = 0;
  personas : any;
  model_ubicacion = {
    id_row : 0,
    id_lugar : 0,
    ide : "",
    tipo : "O",
    lugar : "",
    fecha_hora : "",
    distancia_recorrida : "",
    btn : false
  }
  nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
  importe = {
    file : ""
  };
  modal_mercancia: any;
  claves_unidad: any;
  claves_unidad_copy: any;
  embalajes : any;
  embalajes_copy: any;
  monedas_copy: any;
  concepto_disable = false;

  constructor(
    private empresa_service: EmpresaService,
    private concepto_service : ConceptoService,
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private cliente_service : ClienteService,
    private serie_service : SerieService,
    private factura_service : FacturacionService
  ) {  }

  ngOnInit(): void {
    this.mostrarEmpresas();
    this.mostrarEstado();
    this.mostrarClientes();
    this.mostrarCatalogos();
    this.UbicacionSource.data.push(this.model_ubicacion);
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
      otros_tipo : "",
      importe : "0.00",
      neto : "0.00",
      neto_print : "",
      btn : false
    });
    this.mercancias = [];
  }

  mostrarCatalogos(){
    this.formas_pago = [];
    this.metodos_pago = [];
    this.monedas = [];
    this.monedas_copy = [];
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
        this.monedas_copy = object;
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
        this.mostrarConceptos("");
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
  }

  obtenerFolio(id_serie : any){
    this.serie_service.facObtenerFolio(id_serie)
    .subscribe((object : any) => {
      if(object.ok){
        this.datos_factura.folio = object.data;
      }
    })
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

  mostrarConceptos(busqueda : any){
    this.conceptos = [];
    let json = {
      id_empresa : this.id_empresa,
      busqueda : busqueda
    };
    this.concepto_service.buscarConceptos(json)
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
        element.otros_tipos = concepto.tipo_otros;
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

  optionEstado(value : any, tipo : any){
    if(tipo == 1){
      this.cliente.direccion.estado = value.option.id;
    }
    if(tipo == 2){
      this.ope.direccion.estado = value.option.id;
    }
  }

  mostrarSeries(id_empresa : any){
    this.series = [];
    this.serie_service.obtenerSeries(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.series = object.data;
        this.serieControl.setValue(object.data[0].serie);
        this.datos_factura.id_serie = object.data[0].id_serie;
        this.obtenerFolio(object.data[0].id_serie);
      }
    });
  }

  mostrarDatosTransporte(){
    this.mostrarOperadores(this.id_empresa);
    this.mostrarTrasporte(1);
    this.mostrarTrasporte(2);
    this.mostrarPersona(this.id_empresa);
  }

  mostrarDatosUbicacion(){
    this.mostrarUbicaciones("");
  }

  mostrarDatosMercancia(){
    this.mostrarClaveUnidad();
    this.mostrarEmbalaje();
  }

  mostrarClaveUnidad(){
    this.claves_unidad = [];
    this.claves_unidad_copy = [];
    this.compartido_service.obtenerCatalogo("sat_UnidadPeso")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.claves_unidad = object;
        this.claves_unidad_copy = object;
      }
    });
  }

  buscarClave(){
    this.claves_unidad_copy = [];
    this.claves_unidad.forEach((element : any) => {
      this.claves_unidad_copy.push({
        "descripcion" : element.descripcion,
        "clave" : element.clave,
        "id_UnidadPeso" : element.id_UnidadPeso
      });
    });
    if(this.filterControlClave.value.length > 0){
      this.claves_unidad_copy = [];
      this.claves_unidad.forEach((element : any) => {
        console.log(element.descripcion.includes(this.filterControlClave.value.toUpperCase()));
        if(element.descripcion.toLowerCase().includes(this.filterControlClave.value.toLowerCase()) || element.clave.includes(this.filterControlClave.value.toUpperCase())){ 
          this.claves_unidad_copy.push({
            "descripcion" : element.descripcion,
            "clave" : element.clave,
            "id_UnidadPeso" : element.id_UnidadPeso
          })
        }
      });
    }
  }

  optionClave(event : any){
    this.datos_mercancia.clave_uni = event.option.id;
  }

  mostrarEmbalaje(){
    this.embalajes = [];
    this.embalajes_copy = [];
    this.compartido_service.obtenerCatalogo("sat_TipoEmbalaje")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.embalajes = object;
        this.embalajes_copy = object;
      }
    });
  }

  buscarEmbalaje(){
    this.embalajes_copy = [];
    this.embalajes.forEach((element : any) => {
      this.embalajes_copy.push({
        "descripcion" : element.descripcion,
        "clave" : element.clave,
        "id_TipoEmbalaje" : element.id_TipoEmbalaje
      });
    });
    if(this.filterControlEmbalaje.value.length > 0){
      this.embalajes_copy = [];
      this.embalajes.forEach((element : any) => {
        if(element.descripcion.toLowerCase().includes(this.filterControlEmbalaje.value.toLowerCase()) || element.clave.includes(this.filterControlEmbalaje.value.toUpperCase())){ 
          this.embalajes_copy.push({
            "descripcion" : element.descripcion,
            "clave" : element.clave,
            "id_TipoEmbalaje" : element.id_TipoEmbalaje
          })
        }
      });
    }
  }
  
  optionEmbalaje(event : any){
    this.datos_mercancia.embalaje = event.option.id;
  }
  
  buscarMoneda(){
    this.monedas_copy = [];
    this.monedas.forEach((element : any) => {
      this.monedas_copy.push({
        "descripcion" : element.descripcion,
        "clave_moneda" : element.clave_moneda,
        "id_catmoneda" : element.id_catmoneda
      });
    });
    if(this.filterControlMonedas.value.length > 0){
      this.monedas_copy = [];
      this.monedas.forEach((element : any) => {
        if(element.descripcion.toLowerCase().includes(this.filterControlMonedas.value.toLowerCase()) || element.clave_moneda.includes(this.filterControlMonedas.value.toUpperCase())){ 
          this.monedas_copy.push({
            "descripcion" : element.descripcion,
            "clave_moneda" : element.clave_moneda,
            "id_catmoneda" : element.id_catmoneda
          })
        }
      });
    }
  }

  optionMoneda(event : any){
    this.datos_mercancia.moneda = event.option.id;
  }

  mostrarUbicaciones(busqueda : any){
    this.ubicaciones = [];
    let json = {
      id_cliente : this.cliente_seleccionado,
      busqueda : busqueda,

    }
    this.factura_service.facObtenerUbicacion(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.ubicaciones =  object.data;
      }
    });
  }

  optionUbicacion(event : any, id : any){
    let ide = "";
    let tipo = "";
    this.ubicaciones.forEach((element : any) => {
      if(element.id_ubicacion == event.option.id){
        tipo = element.tipo;
        ide = element.folio_sat;
      }
    });
    if(id != 0){
      if(tipo != "O"){
        this.UbicacionSource.data.forEach((element : any) => {
          if(element.id_row == id){
            element.id_lugar = event.option.id;
            element.ide = ide;
            element.tipo = tipo;
          }
        });
      }else{
        this.UbicacionSource.data.forEach((element : any) => {
          if(element.id_row == id){
            element.lugar = "";
          }
        });
        Swal.fire("Aviso","No se puede agregar más de una ubicacion de Origen","info");
      }
    }else{
      if(tipo != "D"){
        this.UbicacionSource.data.forEach((element : any) => {
          if(element.id_row == id){
            element.id_lugar = event.option.id;
            element.ide = ide;
            element.tipo = tipo;
          }
        });
      }else{
        this.UbicacionSource.data.forEach((element : any) => {
          if(element.id_row == id){
            element.lugar = "";
          }
        });
        Swal.fire("Aviso","La primero ubicacion debe ser una de Origen","info");
      }
    }
  }

  mostrarOperadores(id : any){
    this.operadores = [];
    this.factura_service.facObtenerOperadores(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.operadores = object.data;
      }
    });
  }

  optionOperador(event : any){
    this.cataporte.transporte.id_operador = event.option.id;
  }

  mostrarPersona(id : any){
    this.personas = [];
    this.factura_service.facObtenerPersona(id)
    .subscribe((object : any) => {
      if(object.ok){
        this.personas = object.data;
      }
    });
  }

  optionPropietario(event : any){
    this.cataporte.transporte.id_propietario = event.option.id;
  }

  mostrarTrasporte(tipo : any){
    if(tipo == 1){
      this.transportes = [];
    }
    if(tipo == 1){
      this.remolques = [];
    }
    this.factura_service.facObtenerTransporte(this.id_empresa,tipo)
    .subscribe((object : any) => {
      if(object.ok){
        if(tipo == 1){
          this.transportes = object.data;
        }
        if(tipo == 2){
          this.remolques = object.data;
        }
      }
    });
  }

  optionTrasporte(event : any){
    if(this.tipo_vehiculo == 1){
      this.cataporte.transporte.id_vehiculo = event.option.id;
    }
  }

  mostrarConfigTransporte(){
    this.config_transportes = [];
    this.compartido_service.obtenerCatalogo("sat_ConfigAutotransporte")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.config_transportes = object;
      }
    });
  }

  mostraTipoPermiso(){
    this.tipo_permisos = [];
    this.compartido_service.obtenerCatalogo("sat_TipoPermiso")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.tipo_permisos = object;
      }
    });
  }

  mostraSubtipoRemolques(){
    this.tipos_remolques = [];
    this.compartido_service.obtenerCatalogo("sat_SubtipoRemolque")
    .subscribe((object : any) => {
      if(object.length > 0){
        this.tipos_remolques = object;
      }
    });
  }

  optionRemolque(event : any){
    this.cataporte.transporte.id_remolque = event.option.id;
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
      otros_tipo : "",
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
      total = subtotal;
      descuento += parseFloat(element.descuento);
      total += descuento;
      iva += parseFloat(element.iva);
      total += iva;
      ieps += parseFloat(element.ieps);
      total += ieps;
      if(element.otros_tipos == "T"){
        otros += parseFloat(element.otros);
      }else{
        otros -= parseFloat(element.otros);
      }
      total += otros;
    });
    const formatter = new Intl.NumberFormat('en-NZ', {
      currency: 'NZD',
      minimumFractionDigits: 2,
      maximumFractionDigits : 2
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
    this.tipo_modal = 1;
    this.openModal(1);
  }

  altaCliente(){
    if(this.cliente.direccion.estado != ""){
      this.confirmar("Confirmación","¿Seguro que desas dar de alta un nuevo cliente?","info",null,1);
    }else{
      Swal.fire("Aviso","Favor de seleccionar un estado","info");
    }
  }

  usaConcepto(){
    if(this.datos_factura.tipo_comprobante == '3'){
      this.concepto_disable = true;
    }else{
      this.concepto_disable = false;
    }
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
    if(this.datos_factura.usa_cataporte){
      if(this.UbicacionSource.data.length <= 1){
        Swal.fire("Aviso","Es necesario agregar almenos una ubicación de destino","info");
        return "";
      }
      if(this.mercancias.length == 0){
        Swal.fire("Aviso","Es necesario almenos agregar una mercancia al cataporte","info");
        return "";
      }
      if(this.cataporte.transporte.id_operador == 0){
        Swal.fire("Aviso","Es necesario seleccionar el operador","info");
        return "";
      }
      if(this.cataporte.transporte.id_vehiculo == 0){
        Swal.fire("Aviso","Es necesario seleccionar el vehiculo","info");
        return "";
      }
      this.cataporte.ubicaciones = this.UbicacionSource.data;
      this.cataporte.mercancias = this.mercancias;
    }
    this.datos_factura.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Seguro que deseas guardar está factura?","info",null,3);
    return "";
  }

  nuevaUbicacion(){
    this.openModal(2);
  }

  altaUbicacion(){
    this.confirmar("Confirmación","¿Seguro que deseas agregar esta ubicacion?","info",null,7);
  }

  nuevaLineaUbicacion(){
    this.UbicacionSource.data.push({
      id_row: this.UbicacionSource.data.length + 1,
      id_lugar: 0,
      ide: "",
      tipo : "D",
      lugar: "",
      fecha_hora: "",
      distancia_recorrida: "",
      btn: true
    });
    this.table.renderRows();
  }

  eliminarUbicacion(id : any){
    this.UbicacionSource.data.forEach((element : any, index : any) => {
      if(element.id_row == id){
        this.UbicacionSource.data.splice(index,1);
      }
    });
    this.table.renderRows();
  }

  nuevoTransporte(tipo : any){
    this.tipo_vehiculo = tipo;
    if(tipo == 2){
      this.mostraSubtipoRemolques();
    }
    this.openModal(3);
  }

  altaTransporte(){
    this.datos_transporte.tipo_vehiculo = this.tipo_vehiculo;
    this.datos_transporte.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Seguro que deseas agregar un nuevo transporte?","info",null,5);
  }

  nuevaPersona(tipo : any){
    this.tipo_persona = tipo; 
    this.openModal(4);
  }

  altaPersona(){
    if(this.tipo_persona == 1){
      this.ope.id_empresa = this.id_empresa;
      this.confirmar("Confirmación","¿Seguro que deseas agregar un nuevo operador?","info",null,4);
    }
    if(this.tipo_persona == 2){
      this.ope.id_empresa = this.id_empresa;
      this.confirmar("Confirmación","¿Seguro que lo deseas agregar a tu catalogo?","info",null,6);
    }
  }

  agregarMercancia(){
    this.total += parseFloat(this.datos_mercancia.valor);
    this.peso_total += parseFloat(this.datos_mercancia.peso);
    this.mercancias.push({
      id_row : this.mercancias.length+1,
      bienes_trans : this.datos_mercancia.bienes_trans,
      clave_prod : this.datos_mercancia.clave_prod,
      descripcion : this.datos_mercancia.descripcion.toUpperCase(),
      clave_uni : this.datos_mercancia.clave_uni,
      dimensiones : this.datos_mercancia.dimensiones,
      cantidad : this.datos_mercancia.cantidad,
      unidad : this.datos_mercancia.unidad,
      embalaje : this.datos_mercancia.embalaje,
      desc_embalaje : this.datos_mercancia.desc_embalaje,
      peso : this.datos_mercancia.peso,
      meterial_pel : false,
      valor : this.datos_mercancia.valor,
      moneda : this.datos_mercancia.moneda,
      fraccion_aran : this.datos_mercancia.fraccion_aran,
      uuid_ext : this.datos_mercancia.uuid_ext
    });
    this.datos_mercancia = {
      bienes_trans : "",
      clave_prod : "",
      descripcion : "",
      clave_uni : "",
      dimensiones : "",
      cantidad : "",
      unidad : "",
      embalaje : "",
      desc_embalaje : "",
      peso : "",
      meterial_pel : false,
      valor : "",
      moneda : "",
      fraccion_aran : "",
      uuid_ext : ""
    };
    this.filterControlClave.setValue("");
    this.filterControlEmbalaje.setValue("");
    this.filterControlMonedas.setValue("");
    this.cerrarModal(6);
  }

  openModal(tipo : any) {
    if(tipo == 1){
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modalUbicacion = this.modalService.open(this.contenidoDelModalUbicacion,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 3){
      
      if(this.tipo_vehiculo == 2){
        this.modalTransporte = this.modalService.open(this.contenidoDelModalTransporte,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
      }
      if(this.tipo_vehiculo == 1){
        this.mostrarConfigTransporte();
        this.mostraTipoPermiso();
        this.modalTransporte = this.modalService.open(this.contenidoDelModalTransporte,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
      }
    }
    if(tipo == 4){
      this.modalOperador = this.modalService.open(this.contenidoDelModalOperador,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 5){
      this.importe.file = "";
      this.nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
      this.modal_control_excel = this.modalService.open(this.modal_excel,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 6){
      this.modal_mercancia = this.modalService.open(this.contenidoDelModalMercancia,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
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
    if(tipo == 5){
      this.modal_control_excel.close();
    }
    if(tipo == 6){
      this.modal_mercancia.close();
    }
  }

  limpiarCampos(){
    this.direccion = new Direccion(0,"","","","","","","","","","","");
    this.cliente = {
      id_cliente : 0,
      id : this.cliente_seleccionado,
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

  limpiarCamposCataporte(){
    this.peso_total = 0;
    this.total = 0;
    this.cataporte = {
      ubicaciones : [],
      transporte : {
        operador : "",
        id_operador : 0,
        vehiculo : "",
        id_vehiculo : 0,
        id_remolque : 0,
        remolque : "",
        id_propietario : 0,
        propietario : "",
      },
      mercancias : []
    }
    this.mercancias = [];
    this.UbicacionSource.data = [];
  }

  limpiarCamposFactura(){
    this.filterControlCliente.setValue("");
    this.dataSource.data = [];
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
      otros_tipo : "",
      importe : "0.00",
      neto : "0.00",
      neto_print : "",
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
      usa_ine : false,
      usa_cataporte : false,
      cataporte : this.cataporte,
      conceptos : this.dataSource.data,
      subtotal : "0.00",
      descuento_t : "0.00",
      iva_t : "0.00",
      ieps_t : "0.00",
      otros_t : "0.00",
      total : "0.00",
      usuario_creacion : this.usuario
    };
    this.peso_total = 0;
    this.total = 0;
    this.mostrarDatos = true;
    this.band_view = false;
  }

  previsualizarPDF(){
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
    this.factura_service.preview(this.datos_factura)
    .subscribe((object : any) => {
      var byteCharacters = atob(object.data);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    });
    return "";
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
              this.cliente = {
                id_cliente : 0,
                id : this.cliente_seleccionado,
                razon_social : "",
                rfc : "",
                curp : "",
                telefono : "",
                mail : "",
                direccion : this.direccion,
                usuario_creacion : this.usuario
              };
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
              this.obtenerFolio(this.datos_factura.id_serie);
              this.limpiarCamposFactura();
              this.limpiarCamposCataporte();
              if(object.data == "1"){ 
                Swal.fire("Buen trabajo","La factura ha sido almacenada correctamente","success");
              }else{
                //DESCARGA PDF
                var byteCharacters = atob(object.data.docB64);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var file = new Blob([byteArray], { type: 'application/pdf;base64' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);

                //DESCARGA XML
                if(object.data.xml != "" || object.data.xml != null){
                  byteCharacters = atob(object.data.xml);
                  byteNumbers = new Array(byteCharacters.length);
                  for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  byteArray = new Uint8Array(byteNumbers);
                  file = new Blob([byteArray], { type: 'application/octet-stream;base64' });

                  var elem = window.document.createElement('a');
                  elem.href = window.URL.createObjectURL(file);
                  elem.download = 'factura.xml';
                  document.body.appendChild(elem);
                  elem.click();
                  document.body.removeChild(elem);
                }
                
                Swal.fire("Buen trabajo","La factura ha sido almacenada y descargada correctamente","success");
              }
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 4){  //Alta operador
          this.factura_service.facAltaOperador(this.ope)
          .subscribe((object : any) => {
            if(object.ok){
              this.direccion = new Direccion(0,"","","","","","","","","","","");
              this.ope = new Operador(this.id_empresa,"","","","",this.direccion);
              this.cerrarModal(4);
              Swal.fire("Buen trabajo","El operador se guardado con éxito","success");
            }
          });
        }
        if(tipo == 5){
          this.factura_service.facAltaVehiculo(this.datos_transporte)
          .subscribe((object : any) => {
            if(object.ok){
              this.mostrarTrasporte(this.tipo_vehiculo);
              this.datos_transporte = {
                tipo_vehiculo : 0,
                id_empresa : 0,
                num_economico : "",
                placa : "",
                anio : "",
                tipo_permiso : "0",
                configuracion : "0",
                num_permiso : "",
                aseguradora_resp_civil : "",
                poliza_resp_civil : "",
                aseguradora_ambiente : "",
                poliza_ambiente : "",
                aseguradora_carga : "",
                poliza_carga : "",
                prima_seguro : ""
              };
              this.cerrarModal(3);
              Swal.fire("Buen trabajo","El transporte se guardado con éxito","success");
            }
          });
        }
        if(tipo == 6){
          this.factura_service.facAltaPersona(this.ope)
          .subscribe((object : any) => {
            if(object.ok){
              this.direccion = new Direccion(0,"","","","","","","","","","","");
              this.ope = new Operador(this.id_empresa,"","","","",this.direccion);
              this.cerrarModal(4);
              Swal.fire("Buen trabajo","El operador se guardado con éxito","success");
            }
          });
        }
        if(tipo == 7){
          this.factura_service.facAltaUbicacion(this.datos_ubicacion)
          .subscribe((object : any) => {
            if(object.ok){
              this.datos_ubicacion = {
                id_cliente : this.cliente_seleccionado,
                tipo : "",
                lugar : "",
                rfc : "",
                folio_sat : "",
                nombre : "",
                direccion  : this.direccion
              };
              this.mostrarUbicaciones("");
              this.cerrarModal(2);
              Swal.fire("Buen trabajo","La ubicacion se ha agregado a su catalogo","success");
            }
          });
        }
      }
    });
  }

  changeTab() { 
    this.selectedTab += 1; 
  }

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "xlsx"){
       this.nombre_archivo = archivos.name;
       this.convertirFileAB64(archivos).then( respuesta => {
        this.importe.file = respuesta+"";
      });
      }else{
        this.nombre_archivo = "Arrastre y suelte o haga click para abrir el buscador";
        Swal.fire("Ha ocurrido un error","Tipo de archivo no permitido","error");
      }
    }
  }

  convertirFileAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  importarExcel(){
    if(this.importe.file == ""){
      Swal.fire("Aviso","Primero adjunta un arhivo valido","info");
    }else{
      this.openModal(5);
      
    }
  }

  consumoReporte(tipo : any){
    if(tipo == 1){
      this.factura_service.getImportMercancias()
      .subscribe((object : any) => {
        if(object.ok){
          let win = window.open("ReporteAlta","_blank");
          let html = '';
          html += '<html>';
          html += '<body style="margin:0!important">';
          html += '<embed width="100%" height="100%" src="data:application/pdf;base64,'+object.data+'" type="application/pdf" />';
          html += '</body>';
          html += '</html>';
          win?.document.write(html);
        }
      });
      // window.open(SERVER_API+'reporte/reporteContrato/'+id_detalle);
    }
    if(tipo == 3){
      this.factura_service.getImportMercancias()
      .subscribe((object : any) => {
        if(object.ok){
          var arrayBuffer = this.base64ToArrayBuffer(object.data);
          var newBlob = new Blob([arrayBuffer], { type: "application/octet-stream" });
          var data = window.URL.createObjectURL(newBlob);
          let link  = document.createElement('a');
          link.href = data;
          link.download = "FormatoAlta.xlsx";
          link.click();
        }
      });
    }
  }

  base64ToArrayBuffer(base64 : string) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }
}
