import { Component, OnInit } from '@angular/core';
import { ContabilidadService } from 'src/app/services/contabilidad/contabilidad.service';
import * as xml2js from 'xml2js';  
import Swal from'sweetalert2';
import { timer } from 'rxjs';

@Component({
  selector: 'app-xml-upload',
  templateUrl: './xml-upload.component.html',
  styles: [
  ]
})
export class XmlUploadComponent implements OnInit {

  result = '';
  public xmlItems: any;
  miEmpresa = window.sessionStorage["empresa"];
  miArreglo: any = [];
  archivos = '';
  miObjeto: any = {
    usuario: 1,
    empresa: this.miEmpresa,
    data: this.miArreglo
  };
  timeLeft: number = 60;
  interval: any;
  cargando = false;
  constructor(
    private contabilidadService: ContabilidadService
  ) { }

  ngOnInit(): void {
  }
  async save(event: any) {
    this.cargando = true;
    this.llenarData(event).then( respuesta => {
      console.log(respuesta);
      this.miObjeto = {
        usuario: 1,
        empresa: this.miEmpresa,
        data: respuesta
      };
      const source = timer(1000);
      const subscribe = source.subscribe(val => this.contabilidadService.altaXML(this.miObjeto)
      .subscribe( (object) =>{
        console.log(object);
        if(object.ok){
          Swal.fire("Buen trabajo","Los xml han sido almacenados correctamente","success");
          this.cargando = false;
          this.miArreglo = [];
        }else{
          this.cargando = false;
          Swal.fire("Ha ocurrido un error",object.message,"error");
        }
      }));
    });
      console.log(this.miObjeto);
    this.archivos = '';
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
      resolve(this.miArreglo);
    });
  }


  async addArregloXml(selectFile: any){
    const reader = new FileReader();
    var iva = 0;
    var ieps = 0;
    var clave_sat = 0;
    var aux_impuesto = '';
    var obj_traslado: any;
    var longitud_traslado = 0;
    var tiene_impuesto = false;
    var tiene_valor_impuesto = false;
    reader.onload = (evt) => {
    const xmlData: string = (evt as any).target.result;
    const parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
    parser.parseString(xmlData,  (err: any, result: any) => {
        var obj = result;
        tiene_impuesto = obj["cfdi:Comprobante"].hasOwnProperty("cfdi:Impuestos")
        if(tiene_impuesto){
            if(obj["cfdi:Comprobante"]["cfdi:Impuestos"][0].length == 0){
              ieps = 0;
              clave_sat = 0;
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
        this.miArreglo.push({
          tipo: obj["cfdi:Comprobante"]["$"]["TipoDeComprobante"],
          uuid: obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"],
          fechaTimbrado: obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],
          fecha: obj["cfdi:Comprobante"]["$"]["Fecha"],
          rfcEmisor: obj["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"],
          rfcReceptor: obj["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"],
          razonEmisor: obj["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Nombre"],
          razonReceptor: obj["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Nombre"],
          folio: (obj["cfdi:Comprobante"]["$"].hasOwnProperty("Folio")) ? obj["cfdi:Comprobante"]["$"]["Folio"] : "",
          metodopago: (obj["cfdi:Comprobante"]["$"].hasOwnProperty("cfdi:MetodoPago")) ? obj["cfdi:Comprobante"]["$"]["MetodoPago"]: "",
          formapago: (obj["cfdi:Comprobante"]["$"].hasOwnProperty("FormaPago")) ? obj["cfdi:Comprobante"]["$"]["FormaPago"] : "",
          moneda:  obj["cfdi:Comprobante"]["$"]["Moneda"],
          subtotal:  obj["cfdi:Comprobante"]["$"]["SubTotal"],
          total: obj["cfdi:Comprobante"]["$"]["Total"],
          iva: iva,
          clave_sat: clave_sat,
          ieps: ieps,
          retencion_iva: 11,
          retencion_isr:  22,
          xml: xmlData
        });
      });
    };
    reader.readAsText(selectFile);
  }
}