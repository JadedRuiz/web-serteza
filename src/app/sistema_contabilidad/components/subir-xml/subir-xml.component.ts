import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, SelectControlValueAccessor } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import { config } from 'process';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { FacturacionService } from 'src/app/services/Facturacion/Facturacion.service';

declare var $:any;

@Component({
  selector: 'app-subir-xml',
  templateUrl: './subir-xml.component.html',
  styleUrls: ['./subir-xml.component.css'],
  providers : [NgbPopoverConfig]
})
export class SubirXmlComponent implements OnInit {

  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;
  public text_input = "Directorio sin seleccionar";
  public list_files = [
    {
      n_file : 0,
      data : '',
      nombre : "Aún no se han seleccionado archivos",
      start : true,
      success : false,
      reload : -1,
      detalle : '',
    }
  ];
  id_empresa = 0;

  constructor(
    private empresa_service: EmpresaService,
    private modalService: NgbModal,
    private config: NgbPopoverConfig,
    private fac_service : FacturacionService) { }

  ngOnInit(): void {
    // customize default values of popovers used by this component tree
    this.config.placement = 'right';
    this.config.container = 'body';
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

  seleccionarDir(event : any){
    let files = event.target.files;
    if(files.length == 0){
      this.text_input = "Directorio sin seleccionar";
      return;
    }
    this.list_files = [];
    if(files.length == 1){
      if(files[0].type == "zip"){

      }
      this.text_input = files[0].name;
      this.list_files.push({
        n_file : 0,
        data : '',
        nombre : files[0].name,
        start :  false,
        success : true,
        reload : -1,
        detalle : ''
      });
      return;
    }
    this.text_input = files.length+" Archivos seleccionados";
    for(let i=0; i< files.length; i++){
      if(files[i].type == "text/xml"){
        this.convertirImagenAB64(files[i]).then( respuesta => {
          this.list_files.push({
            n_file : i,
            data : respuesta+"",
            nombre : files[i].name,
            start :  false,
            success : true,
            reload : -1,
            detalle : ''
          });
        });
      }else{
        this.list_files.push({
          n_file : i,
          data : '',
          nombre : files[i].name,
          start :  false,
          success : false,
          reload : -1,
          detalle : 'Tipo de archivo no permitido'
        });
      }
    }
  }

  eliminarArchivo(id : number){
    this.list_files.forEach((element : any, index : any) => {
      if(element.n_file == id){
        this.list_files.splice(index, 1);
        this.text_input = this.list_files.length+" Archivos seleccionados";
      }
    });
  }

  altaBobedaXML(){
    let json = {
      id_empresa : this.id_empresa,
      usuario_c : this.usuario_logueado,
      data : ''
    };
    this.list_files.forEach(async (element : any) => {
      if(element.data != ""){
        json.data = element.data;
        element.reload = 1;
        await this.fac_service.facSubirXML(json)
        .subscribe((object : any) => {
          if(object.ok){
            element.reload = 2;
          }else{
            element.reload = 3;
            element.success = false;
            element.detalle = object.message;
          }
        });
      }
    })
  }

  convertirImagenAB64(fileInput : any){
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

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, size : 'md', backdropClass : 'light-blue-backdrop'});
  }

  closeModal(){
    this.modal.close();
  }


}
