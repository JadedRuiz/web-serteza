import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { Empresa } from 'src/app/models/Empresa';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';

@Component({
  selector: 'app-catalogo-empresa',
  templateUrl: './catalogo_empresa.component.html',
  styleUrls: ['./catalogo_empresa.component.css']
})
export class CatalogoEmpresaComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public cliente_seleccionado = window.sessionStorage.getItem("cliente");
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public empresa = {
    id_empresa : "",
    empresa : "",
    razon_social : "",
    rfc : "",
    descripcion : "",
    representante : {
      nombre : "",
      rfc : "",
      curp : "",
      cargo : ""
    },
    direccion : this.direccion,
    fotografia : this.fotografia,
    usuario_creacion : this.usuario
  }
  empresa_seleecionada = "";
  filterControlEmpresa = new FormControl();
  empresas : any;
  empresas_busqueda : any;
  filterControlEstado = new FormControl();
  estados : any;
  estados_busqueda : any;
  public band = true;
  tipo_modal = 0;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal_config : any;
  @ViewChild('modal_config', {static: false}) contenidoDelModalConfig : any;
  public activo = true;
  public foto_user : any;
  public docB64 = "";
  //Modelo tabla
  displayedColumns: string[] = ['Id', 'Empresa', "Representante", 'Razon', "accion"];
  dataSource  = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator : any;
  info_modal = {
    nombre_empresa : "",
    tipo : 0
  };
  //Configuraciones
  selected = 1;
  public nominas : any;
  public nominas_busqueda : any;
  public nominas_seleccionados : any;
  busqueda_nomina = "";


  constructor(
    private modalService: NgbModal,
    private empresa_service: EmpresaService,
    private compartido_service : CompartidoService,
    private nomina_service : NominaService,
    private sanitizer: DomSanitizer
  ) {
    this.nominas_seleccionados = [];
    this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
   }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }

  mostrarEmpresas(){
    let json = {
      palabra : "",
      taken : 1000,
      status : 2,
      pagina : 0
    };
    this.empresas_busqueda = [];
    this.empresas = [];
    this.empresa_service.obtenerEmpresas(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.dataSource.data = object.data.registros;
        this.dataSource.paginator = this.paginator;
        this.empresas = object.data.registros;
        this.empresas_busqueda = object.data.registros;
      }
    });
  }

  
  mostrarNominasEmpresa(id_empresa : any){
    let json = {
      id_empresa : id_empresa,
      id_status : 1
    };
    this.nomina_service.obtenerLigaEmpresaNomina(json)
    .subscribe((object : any) => {
      if(object.ok){
        object.data.forEach((element : any) => {
          this.nominas_busqueda.forEach((nomina : any) => {
            if(parseInt(element.id_nomina) == parseInt(nomina.id_nomina) && parseInt(element.activo) == 1){
              nomina.activo = true;
            }
          });
        });
        // console.log(this.nominas_busqueda);
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
    this.visualizar(value.option.id);
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
    this.empresa.direccion.estado = value.option.id;
  }

  mostrarNomina(){
    this.nominas = [];
    this.nominas_busqueda = [];
    this.compartido_service.obtenerCatalogo('nom_cat_nomina')
    .subscribe((object : any) => {
      if(object.length > 0){
        object.forEach((element : any) => {
          if(element.activo){
            this.nominas.push({
              id_nomina : element.id_nomina,
              nomina : element.nomina,
              activo : false
            });
            this.nominas_busqueda.push({
              id_nomina : element.id_nomina,
              nomina : element.nomina,
              activo : false
            });
          }
        });
      }
    });
  }

  buscarNomina(){
    this.nominas_busqueda = [];
    this.nominas.forEach((element : any) => {
      this.nominas_busqueda.push({
        "nomina" : element.nomina,
        "id_nomina" : element.id_nomina,
        "activo" : element.activo
      });
    });
    if(this.busqueda_nomina.length > 0){
      this.nominas_busqueda = [];
      this.nominas.forEach((element : any) => {
        if(element.nomina.includes(this.busqueda_nomina.toUpperCase())){ 
          this.nominas_busqueda.push({
            "nomina" : element.nomina,
            "id_nomina" : element.id_nomina,
            "activo" : element.activo
          })
        }
      });
      // this.pintarEntidades(this.sistema_config);
    }
  }

  setNomina(event : any){
    let json = {
      id_empresa : this.empresa_seleecionada,
      id_nomina : event.option.value
    };
    if(event.option.selected){
      this.nomina_service.insertarLigaNominaEmpresa(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.nominas.forEach((element : any) => {
            if(element == event.option.value){
              element.activo = true;
            }
          });
        }
      });
    }else{
      this.nomina_service.eliminarLigaEmpresaNomina(json)
      .subscribe((object : any) => {
        if(object.ok){
          this.nominas.forEach((element : any) => {
            if(element == event.option.value){
              element.activo = false;
            }
          });
        }
      });
    }
  }

  visualizar(id_empresa : any){
    this.empresa_service.obtenerEmpresaPorId(id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.mostrarEstado();
        this.openModal(1);
        this.info_modal.tipo = 2;
        this.info_modal.nombre_empresa = object.data[0].empresa;
        this.empresa.id_empresa = object.data[0].id_empresa;
        this.empresa.empresa = object.data[0].empresa;
        this.empresa.rfc = object.data[0].rfc;
        this.empresa.descripcion = object.data[0].descripcion;
        this.empresa.razon_social = object.data[0].razon_social;
        this.empresa.direccion.id_direccion = object.data[0].id_direccion;
        this.empresa.direccion.calle = object.data[0].id_sucursal;
        this.empresa.direccion.calle = object.data[0].id_sucursal;
        this.empresa.direccion.calle = object.data[0].calle;
        this.empresa.direccion.numero_exterior = object.data[0].numero_exterior;
        this.empresa.direccion.numero_interior = object.data[0].numero_interior;
        this.empresa.direccion.cruzamiento_uno = object.data[0].cruzamiento_uno;
        this.empresa.direccion.colonia = object.data[0].colonia;
        this.empresa.direccion.codigo_postal = object.data[0].codigo_postal;
        this.empresa.direccion.estado = object.data[0].id_estado;
        this.empresa.direccion.localidad = object.data[0].localidad;
        this.empresa.direccion.municipio = object.data[0].municipio;
        this.empresa.direccion.descripcion = object.data[0].descripcion_direccion;
        this.empresa.representante.nombre = object.data[0].representante_legal;
        this.empresa.representante.rfc = object.data[0].rfc_repre;
        this.empresa.representante.cargo = object.data[0].cargo_repre;
        this.empresa.representante.curp = object.data[0].curp;
        this.empresa.fotografia.id_fotografia = object.data[0].id_fotografia;
        this.foto_user = object.data[0].fotografia;
        this.filterControlEstado.setValue(object.data[0].estado);
      }
    });
  }

  visualizar_configuraciones(id_empresa : any){
    this.openModal(2);
    this.empresa_seleecionada = id_empresa;
    this.mostrarNomina();
    this.mostrarNominasEmpresa(id_empresa)
  }

  nuevaEmpresa(){
    this.limpiarCampos();
    this.mostrarEstado();
    this.openModal(1);
    this.info_modal.nombre_empresa = "Nueva empresa"
    this.info_modal.tipo = 1;
  }

  altaEmpresa(){
    if(this.empresa.empresa == "" || this.empresa.rfc == "" || this.empresa.razon_social == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      this.empresa.usuario_creacion = parseInt(this.usuario+"");
      this.confirmar("Confirmación","¿Seguro que desea guardar la información?","info",1);
    }
  }

  guardar(){
    this.confirmar("Confirmación","¿Seguro que deseas actualizar a la empresa?","info",2);
  }

  limpiarCampos(){
    this.direccion  = new Direccion(0,"","","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","",""); 
    this.foto_user = "./assets/img/defaults/imagen-no-disponible.png";
    this.empresa = {
      id_empresa : "",
      empresa : "",
      razon_social : "",
      rfc : "",
      descripcion : "",
      representante : {
        nombre : "",
        rfc : "",
        curp : "",
        cargo : ""
      },
      direccion : this.direccion,
      fotografia : this.fotografia,
      usuario_creacion : this.usuario
    }
  }

  openModal(tipo : number) {
    if(tipo == 1){
      this.limpiarCampos();
      this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
    if(tipo == 2){
      this.modal_config = this.modalService.open(this.contenidoDelModalConfig,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    }
  }

  cerrarModal(tipo : number){
    if(tipo == 1){
      this.modal.close();
    }
    if(tipo == 2){
      this.modal_config.close();
    }
  }
  
  subirImagen(){
      document.getElementById("foto_user")?.click();
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

  cambiarImagen(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      this.fotografia.extension = extension;
      if(extension == "jpg" || extension == "png" || extension == "jpeg"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta+"";
          this.empresa.fotografia.docB64 = respuesta+"";
          this.empresa.fotografia.extension = extension;
          
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){
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
          this.empresa_service.altaEmpresa(this.empresa)
          .subscribe((object : any)=>{
            if(object.ok){
              this.mostrarEmpresas();
              this.cerrarModal(1);
              Swal.fire("Buen trabajo","Se ha registrado la empresa","success");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.empresa_service.actualizarEmpresa(this.empresa)
          .subscribe((object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha actualizado la empresa","success");
            }
          });
        }
      }
    });
  }
}
