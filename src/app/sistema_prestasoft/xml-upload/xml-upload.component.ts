import { Component, OnInit } from '@angular/core';
import * as xml2js from 'xml2js';  

@Component({
  selector: 'app-xml-upload',
  templateUrl: './xml-upload.component.html',
  styles: [
  ]
})
export class XmlUploadComponent implements OnInit {

  result = '';
  public xmlItems: any;
  miArreglo: any = [];
  cargando = false;
  constructor() { }

  ngOnInit(): void {
  }

  async save(event: any) {
    this.cargando = true;
    console.log(event);
    var longitud = event.target.files;
    longitud = longitud.length;
    var selectFile = 0;
    for(var i = 0; i < longitud; i++){
      selectFile = event.target.files[i];
      await this.addArregloXml(selectFile);
    }
    
    await console.log(this.miArreglo);
  }

  async addArregloXml(selectFile: any){
    const reader = new FileReader();
    reader.onload = (evt) => {
    const xmlData: string = (evt as any).target.result;
    const parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(xmlData,  (err: any, result: any) => {
        var obj = result;
        this.miArreglo.push({
          tipo: obj["cfdi:Comprobante"]["$"]["TipoDeComprobante"],
          uuid: obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["UUID"],
          fechaTimbrado: obj["cfdi:Comprobante"]["cfdi:Complemento"][0]["tfd:TimbreFiscalDigital"][0]["$"]["FechaTimbrado"],
          rfcEmisor: obj["cfdi:Comprobante"]["cfdi:Emisor"][0]["$"]["Rfc"],
          rfcReceptor: obj["cfdi:Comprobante"]["cfdi:Receptor"][0]["$"]["Rfc"],
          xml: xmlData,
        });
      });
    };
    reader.readAsText(selectFile);
  }
}
