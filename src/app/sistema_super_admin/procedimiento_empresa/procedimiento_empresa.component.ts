import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';

@Component({
  selector: 'app-procedimiento-empresa',
  templateUrl: './procedimiento_empresa.component.html',
  styleUrls: ['./procedimiento_empresa.component.css']
})
export class ProcedimientoEmpresaComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public palabra = "";
  public empresas : any;
  public arreglo : any;
  public arreglo_seleccionado : any;
  public band_cliente = false;
  public band_puesto = false;
  public puestos_empresa : any;
  public clientes_empresa : any;
  public id_seleccionado = 0;
  public titulo_modal = "";
  public subtitulo_modal = ""; 
  public tipo_modal = 0;
  public aviso_modal = "";
  public aviso_vacio = "";
  public modal : any;
  public buscador = true;
  public usuario_creacion = window.sessionStorage.getItem("user");
  @ViewChild('content', {static: false}) contenidoDelModal : any;


  constructor(
    private cliente_service : ClienteService,
    private empresa_service : EmpresaService,
    private modalService: NgbModal
  ) {
    this.arreglo_seleccionado = [];
  }

  ngOnInit(): void {
    this.mostrarEmpresas();
  }

  mostrarEmpresas(){
    this.empresas = [];
    let json = {
      "pagina" : 0,
      "taken" : 999,
      "palabra" : this.palabra,
      "status" : 2
    };
    this.empresa_service.obtenerEmpresas(json)
    .subscribe( (object : any)=>{
      if(object.ok && object.data.registros.length > 0){
        for(let i=0;i<object.data.registros.length;i++){
          this.empresas.push({
            "folio" : object.data.registros[i].id_empresa,
            "nombre" : object.data.registros[i].empresa
          });
        }
      }
    });
  }

  mostrarClientesPorIdEmpresa(id_empresa : any){
    this.clientes_empresa = [];
    this.cliente_service.obtenerClientesPorIdEmpresa(id_empresa)
    .subscribe( (object : any)=>{
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          this.band_cliente = true;
          this.clientes_empresa.push({
            "folio" : object.data[i].id_cliente,
            "nombre" : object.data[i].cliente
          });
        }
      }else{
        this.band_cliente = false;
      }
    });
  }

  mostrarClientes(){
    this.arreglo = [];
    let json = {
      "palabra" : this.palabra,
      "taken" : 1000,
      "pagina" : 0,
      "status" : 2 
    };
    this.cliente_service.obtenerClientes(json)
    .subscribe( (object : any) =>{
      if(object.ok){
        for(let i=0;i<object.data.registros.length; i++){
          let band = false;
          for(let o=0; o<this.clientes_empresa.length;o++){
            if(this.clientes_empresa[o].folio == object.data.registros[i].id_cliente){
              band = true;
            }
          }
          if(band){
            this.arreglo.push({
              "nombre" : object.data.registros[i].cliente,
              "folio" : object.data.registros[i].id_cliente,
              "atributo" : "disabled"
            });
          }else{
            this.arreglo.push({
              "nombre" : object.data.registros[i].cliente,
              "folio" : object.data.registros[i].id_cliente,
              "atributo" : ""
            });
          }
        }
      }
    });
  }

  nuevoCliente(){
    this.titulo_modal = "Agregar cliente a empresa";
    this.tipo_modal = 1;
    this.openModal();
    this.subtitulo_modal = "Seleccione los clientes que desea agregarle a está empresa";
    this.aviso_modal = "Si el cliente que esta buscando no existe puede agregarlo en el catálogo de clientes";
    this.mostrarClientes();
    this.aviso_vacio = "No se han encontrado clientes";
    this.buscador = true;
  }

  nuevoPuesto(){
    this.titulo_modal = "Nuevo puesto";
    this.tipo_modal = 2;
    this.buscador = false;
    this.openModal();
    this.subtitulo_modal = "";
    this.aviso_modal = "";
    this.mostrarClientes();
    this.aviso_vacio = "No se han encontrado clientes";
  }

  busqueda(){
    this.mostrarEmpresas();
  }

  altaRegistro(){
    if(this.tipo_modal == 1){
      if(this.arreglo_seleccionado.length == 0){
        Swal.fire("Ha ocurrido un error","Primero selecciona las empresas a agreagarle al usuario","error");
      }else{
        let json = {
          id_empresa : this.id_seleccionado,
          id_cliente : this.arreglo_seleccionado,
          usuario_creacion : this.usuario_creacion
        };
        this.empresa_service.ligarClienteAEmpresa(json)
        .subscribe( (object : any)=> {
          if(object.ok){
            Swal.fire("Buen trabajo","Se han agregado los clientes a la empresa","success");
            this.mostrarClientesPorIdEmpresa(this.id_seleccionado);
            this.cerrarModal();
          }
        });
      }
    }
    if(this.tipo_modal == 2){
      // if(this.arreglo_seleccionado.length == 0){
      //   Swal.fire("Ha ocurrido un error","Primero selecciona los clientes a agreagarle a la empresa","error");
      // }else{
      //   let json = {
      //     id_usuario : this.id_seleccionado,
      //     id_cliente : this.arreglo_seleccionado,
      //     usuario_creacion : this.usuario_creacion
      //   };
      //   this.cliente_service.asignarClienteAUsuario(json)
      //   .subscribe( (object : any)=> {
      //     if(object.ok){
      //       Swal.fire("Buen trabajo","Se han agregado los clientes seleccionadas al usuario","success");
      //       this.mostrarClientePorIdUsuario(this.id_seleccionado);
      //       this.cerrarModal();
      //     }
      //   });
      // }
    }
  }

  eliminarLigaCliente(folio : any){

  }

  seleccionar(folio : any,usuario : any){
    jQuery(".list-group-item").each(function(){
      $(this).removeClass("active");
    });
    jQuery("#empresa_"+folio).addClass("active");
    this.id_seleccionado = folio;
    this.mostrarClientesPorIdEmpresa(folio);
    // this.mostrarClientePorIdUsuario(this.id_seleccionado);
  }

  seleccionarEnModal(folio : any){
    if(jQuery("#arreglo"+folio).hasClass("active")){
      jQuery("#arreglo"+folio).removeClass("active");
      if(this.tipo_modal == 1){
        let index = this.arreglo.indexOf(folio);
        this.arreglo_seleccionado.splice(index,1);
      }
      if(this.tipo_modal == 2){
        let index = this.arreglo.indexOf(folio);
        this.arreglo_seleccionado.splice(index,1);
      }
     }else{ 
      jQuery("#arreglo"+folio).addClass("active");
      if(this.tipo_modal == 1){
        this.arreglo_seleccionado.push(folio);
      }
      if(this.tipo_modal == 2){
        this.arreglo_seleccionado.push(folio);
      }
     }
  }

  limpiarRegistros(){

  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    this.limpiarRegistros();
  }

  cerrarModal(){
    this.modal.close();
  }
}
