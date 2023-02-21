import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Xml } from 'src/app/models/Xml';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import Swal from 'sweetalert2';
import * as xml2js from 'xml2js';  
import { timer } from 'rxjs';
import {formatCurrency, getCurrencySymbol} from '@angular/common';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: []
})
export class FacturasComponent implements OnInit {
  myControl = new FormControl();
  myControlUUID = new FormControl();
  clienteProveedorID = 0;
  options: any[] = [];
  optsUuid: any[] = [];
  miEmpresa = window.sessionStorage["empresa"];
  filteredOptions: Observable<any[]> | undefined;
  opcionesFiltrado: Observable<any[]> | undefined;
  modal: any;
  xml: Xml = new Xml('', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', 0, 0, 0, 0, '', '', 0, 0, 0);
  objetoXml: any = {
    usuario: 1,
    empresa: this.miEmpresa,
    data: [this.xml]
  };
  edito = false;
  periodoDia = false;
  dia = true;
  public taken = 5; //Registros por default
  public total_registros = 0;
  public mostrar_pagination = false;
  public paginas_a_mostrar = 5;
  public paginas : any;
  public pagina_actual = 0;
  public limite_inferior = 0;
  public limite_superior = this.paginas_a_mostrar;
  public next = false;
  public previous = false;
  public band_persiana = true;
  public band = true;
  existe = false;
  id_provcliente = "";
  periodo = false;
  miObjeto: any = {
    id_provcliente: "",
    id_empresa: this.miEmpresa,
    id_bovedaxml: false,
    index: false
  };
  miObjetoCliente: any = {
    id_empresa: this.miEmpresa,
    buscar: "servive"
  };
  miObjetoUuid: any = {
    buscar: "servive",
    id_empresa: this.miEmpresa
  };
  objFactura: any = [];

  objMonedas: any[] = [];
  objTipos: any[] = [];
  objMetodos: any[] = [];
  objConceptos: any[] = [];

  constructor(private contabilidadService: ContabilidadService) { }

  ngOnInit(): void {
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.opcionesFiltrado = this.myControlUUID.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filtroUuid(value))
      );
      this.getMonedas();
      this.getTipos();
      this.getMetodos();
      this.getConceptos();
  }
  getConceptos(){
    this.contabilidadService.obtenerConceptos(this.miEmpresa)
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object);
        this.objConceptos = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getMonedas(){
    this.contabilidadService.obtenerMonedas()
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object);
        this.objMonedas = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getTipos(){
    this.contabilidadService.obtenerTipoComprobantes()
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object);
        this.objTipos = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getMetodos(){
    this.contabilidadService.obtenerMetodoPago()
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object);
        this.objMetodos = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  cambioFechas(evt: any){
    var target = evt.target.value;
    this.objFactura = [];
    if(target == "dia"){
      this.dia = true;
      this.periodo = false;
    }else if(target == "periodo"){
      this.dia = false;
      this.periodo = true;
    }
  }
  private _filter(value: string): string[] {
    if(value.length > 3){
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombrecomercial.toLowerCase().includes(filterValue));
    }
    return [];
  }
  private _filtroUuid(value: string): string[] {
    if(value.length > 3){
      const filterValue = value.toLowerCase();
      return this.optsUuid.filter(optsUuid => optsUuid.uuid.toLowerCase().includes(filterValue));
    }
    return [];
  }
  getFacturas(value: any){
    if(this.dia){
      this.clienteProveedorID = value.option.value["id_provcliente"];
      this.miObjeto.id_provcliente = this.clienteProveedorID;
      this.myControl.patchValue(value.option.value["nombrecomercial"]);
      this.getListadoFacturas();
    }else{
      this.miObjeto.id_provcliente = false;
      this.miObjeto.id_bovedaxml = value.option.value["id_bovedaxml"];
      this.myControlUUID.patchValue(value.option.value["uuid"]);
      this.getListadoFacturas();
      this.actualizar(this.objFactura);
    }
    
  }
  getListadoFacturas(){
    this.contabilidadService.getFacturas(this.miObjeto)
    .subscribe( (object : any) => {
      if(object.ok){
        this.total_registros = object.totales;
        this.edito = true;

        if(this.total_registros > this.taken){
          this.mostrar_pagination = true;
          this.paginar();
        }else{
          this.mostrar_pagination = false;
        }
        //Mostrar usuarios
        this.band = true; 
        this.objFactura = object.datos;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getClienteProveedor(){
    this.contabilidadService.getClienteProveedor(this.miObjetoCliente)
    .subscribe( (object : any) => {
      if(object.ok){    
        this.options = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  paginar(){
    this.paginas = [];
    let paginas_a_pintar = parseInt(this.total_registros + "")%parseInt(this.taken+"");
    if(paginas_a_pintar == 0){
      paginas_a_pintar = (parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+"");
    }else{
      paginas_a_pintar = ((parseInt(this.total_registros+"")-paginas_a_pintar)/parseInt(this.taken+""))+1;
    }
    //Pintamos las flechas
    if(paginas_a_pintar > this.paginas_a_mostrar){
      this.next = true;
    }
    if(this.pagina_actual == paginas_a_pintar){
      this.next = false;
    }
    if(this.pagina_actual > this.paginas_a_mostrar){
      this.previous = true;
    }
    if(this.pagina_actual == 0){
      this.previous = false;
    }
    //Pintamos las paginas
    for(let i =0;i<this.paginas_a_mostrar;i++){
      let pagina_inicial = this.limite_inferior;
      if(i<paginas_a_pintar){
        if(this.pagina_actual == pagina_inicial+i){
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : "active"
          });
        }else{
          this.paginas.push({
            numero : (pagina_inicial+i)+1,
            valor_pagina : pagina_inicial+i,
            active : ""
          });
        }
      }
    }
  }

  irPagina(pagina : any){
    let miIndex = ((pagina + 1) * 5) - 5;
    this.pagina_actual = pagina;
    this.miObjeto.index = miIndex;
    this.getListadoFacturas();
  }
  busqueda(event: string){
    if(event.length > 2){
      this.miObjetoCliente.buscar = event;
      this.getClienteProveedor();
    }
    if(event.length == 0){
      this.objFactura = [];
    }
  }
  busquedaUuid(event: string){
    if(event.length > 2){
      this.miObjetoUuid.buscar = event;
      this.getUuid();
    }
    if(event.length == 0){
      this.objFactura = [];
    }
  }
  getUuid(){
    this.contabilidadService.getUuid(this.miObjetoUuid)
    .subscribe( (object : any) => {
      if(object.ok){    
        this.optsUuid = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  guardarCatalogo(f: NgForm) {
    if ( f.invalid ) {
      return;
    }
      this.miObjeto = {
        usuario: 1,
        empresa: this.miEmpresa,
        data: [this.xml]
      };
      const source = timer(100);
      const subscribe = source.subscribe(val => this.contabilidadService.altaXML(this.miObjeto)
      .subscribe( (object) =>{
        if(object.ok){
          // jQuery("#exampleModal").hide();
          Swal.fire("Buen trabajo","Los xml han sido almacenados correctamente","success");
          this.limpiar();
        }else{
          Swal.fire("Ha ocurrido un error",object.message,"error");
        }
      }));
 
  }
  actualizar(xml: any) {
    this.xml = xml;
    this.xml.tipo_cambio = xml.tipocambio;
    this.xml.ieps = xml.ieps;
    this.xml.tipo = xml.tipo_documento;
    this.xml.razonReceptor = xml.razonsocial;
    this.xml.rfcReceptor = xml.rfc;
    this.xml.id_movfactura = xml.id_movfactura;
    this.xml.id_empresa = xml.id_empresa;
    if(xml.uuid.length > 0){
      this.existe = true;
    }else{
      this.existe = false;
    }
    // this.alimentoService.actualizar(this.alimento.id, this.alimento)
    // .subscribe( objeto => {
    //   console.log(objeto);
    //   this.traerDatos();
    // });
    // .subscribe();
}
  
  async cargarXml(event: any) {
    this.limpiar();
    this.llenarData(event).then( respuesta => {
      // const source = timer(1000);
    });
  }
  llenarData( event: any){
    return new Promise(resolve => {
    var longitud = event.target.files;
    longitud = longitud.length;
    var selectFile = 0;
    for(var i = 0; i < longitud; i++){
      selectFile = event.target.files[i];
       this.addArregloXml(selectFile);
    }
      // resolve(this.miArreglo);
    });
  }
  limpiar(){
    $("#miBoton").removeAttr('disabled');
    this.edito = false;
    this.existe = false;
    this.xml = new Xml('', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, '', 0, 0, 0, 0, '', '', 0, 0, 0);
  }
  async addArregloXml(selectFile: any){
      if(selectFile.type == "text/xml"){
      const reader = new FileReader();
      var iva = 0;
      var ieps = 0;
      var clave_sat = '';
      var aux_impuesto = '';
      var obj_traslado: any;
      var longitud_traslado = 0;
      var tiene_impuesto = false;
      var tiene_valor_impuesto = false;
      var tipo_cambio = 1;
      reader.onload = (evt) => {
      const xmlData: string = (evt as any).target.result;
      const parser = new xml2js.Parser(
            {
              trim: true,
              explicitArray: true
            });
      parser.parseString(xmlData,  (err: any, result: any) => {
          var obj = result;
          if(obj["cfdi:Comprobante"]["$"]["TipoDeComprobante"] == "I"){
          tiene_impuesto = obj["cfdi:Comprobante"].hasOwnProperty("cfdi:Impuestos");
          if (obj["cfdi:Comprobante"]["$"]["Moneda"] == "USD"){
            tipo_cambio = obj["cfdi:Comprobante"]["$"]["TipoCambio"];
          }
          if(tiene_impuesto){
              if(obj["cfdi:Comprobante"]["cfdi:Impuestos"][0].length == 0){
                ieps = 0;
                clave_sat = '0';
                iva = 0;
              }else{
                longitud_traslado = obj["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"].length;
                  obj_traslado = obj["cfdi:Comprobante"]["cfdi:Impuestos"][0]["cfdi:Traslados"][0]["cfdi:Traslado"];
                  for (let i = 0; i < obj_traslado.length; i++) {
                    aux_impuesto = obj_traslado[i]["$"]["Impuesto"];
                    if(aux_impuesto == '003'){
                      ieps = obj_traslado[i]["$"]["Importe"];
                    }else{
                      iva = obj_traslado[i]["$"]["Importe"];
                      clave_sat = obj_traslado[i]["$"]["Impuesto"];
                    }
                  }
            }
          }
            this.xml.tipo= obj["cfdi:Comprobante"]["$"]["TipoDeComprobante"],
            this.xml.uuid= obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"],
            this.xml.fechaTimbrado= obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],
            this.xml.fecha= obj["cfdi:Comprobante"]["$"]["Fecha"],
            this.xml.rfcEmisor= obj["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"],
            this.xml.rfcReceptor= obj["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"],
            this.xml.razonEmisor= obj["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"],
            this.xml.razonReceptor= obj["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Nombre"],
            this.xml.folio= (obj["cfdi:Comprobante"]["$"].hasOwnProperty("Folio")) ? obj["cfdi:Comprobante"]["$"]["Folio"] : "",
            this.xml.metodopago= (obj["cfdi:Comprobante"]["$"].hasOwnProperty("MetodoPago")) ? obj["cfdi:Comprobante"]["$"]["MetodoPago"]: "",
            this.xml.formapago= (obj["cfdi:Comprobante"]["$"].hasOwnProperty("FormaPago")) ? obj["cfdi:Comprobante"]["$"]["FormaPago"] : "",
            this.xml.moneda=  obj["cfdi:Comprobante"]["$"]["Moneda"],
            this.xml.subtotal=  obj["cfdi:Comprobante"]["$"]["SubTotal"],
            this.xml.total= obj["cfdi:Comprobante"]["$"]["Total"],
            this.xml.iva= iva,
            this.xml.clave_sat= clave_sat,
            this.xml.ieps= ieps,
            this.xml.retencion_iva= 0,
            this.xml.retencion_isr=  0,
            this.xml.tipo_cambio= tipo_cambio,
            this.xml.xml= xmlData
         }else{
          Swal.fire("Ha ocurrido un error","Capture los xml de tipo I o E","error");
          $("#miBoton").attr('disabled','disabled');
         }
        });
      };
      reader.readAsText(selectFile);
    }
  }
  saveTextAsFile (data: any, filename: any){
    if(!data) {
        return;
    }
    if(!filename) filename = 'console.json'
    var blob = new Blob([data], {type: 'text/plain'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    }
    else{
      var e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
}
  expFile(obj: any) {
    var fileText = obj.xml;
    var fileName = obj.uuid + ".xml";
    this.saveTextAsFile(fileText, fileName);
  }
  updateValue(value: string) {
    let val = parseInt(value, 10);
    let cantidad = "";
    if (Number.isNaN(val)) {
      val = 0;
    }
    cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
    console.log(cantidad);
}
}
