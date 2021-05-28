import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Contrato } from 'src/app/models/Contrato';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import Swal from 'sweetalert2';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';


@Component({
  selector: 'app-procedimiento-contratacion',
  templateUrl: './procedimiento_contratacion.component.html',
  styleUrls: ['./procedimiento_contratacion.component.css']
})
export class ProcedimientoContratacionComponent implements OnInit {
  
  public color = COLOR;
  public status = 2;
  public palabra = "";
  public band = false;
  public bandera = [true, true, true];
  public usuario_creacion = parseInt(window.sessionStorage.getItem("user")+"");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public contrato = new Contrato(0,"",0,"",0,"",0,"",0,"","0","",this.usuario_creacion);
  public contratos : any;
  public modal : any;
  public taken = 5;
  public solicitud_contratos = new Array<Contrato>();
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  //Paginacion
  public total_registros = 0;
  public mostrar_pagination = false;
  public paginas_a_mostrar = 5;
  public paginas : any;
  public pagina_actual = 0;
  public limite_inferior = 0;
  public limite_superior = this.paginas_a_mostrar;
  public next = false;
  public previous = false;
  //Candidato
  public candidatos : any;
  //Empresa
  public empresas : any;
  //Departamento
  public departamentos : any;
  //Puesto
  public puestos : any;
  public sueldos = ["","",""];

  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private puesto_service : PuestoService,
    private contrato_service : ContratoService
  ) {
    this.modal = NgbModalRef;
   }

  ngOnInit(): void {
    
  }

  mostrarMovimientos(){

  }

  mostrarCandidato(){
    let valor = this.contrato.candidato.split(" ")[1];
    let object = this.candidatos.filter( (x : any) => x.folio === parseInt(valor))[0];
    this.contrato.candidato = object.nombre;
    this.contrato.id_candidato = object.folio;
  }

  mostrarCandidatos(){
    let json = {
      palabra : "",
      taken : 999,
      status : 6,
      pagina : 0,
      id_cliente : this.id_cliente  
    };
    this.candidatos = [];
    this.candidato_service.obtenerCandidatos(json)
    .subscribe( (object : any) => {
      if(object.ok){
        //LLenar los usuarios en la tabla
        for(let i =0; i<object.data.registros.length; i++){
          let nombre = object.data.registros[i].nombre;
          let apellidos = object.data.registros[i].apellido_paterno + " " + object.data.registros[i].apellido_materno;
          this.candidatos.push({
            "folio" : object.data.registros[i].id_candidato,
            "nombre" : apellidos + " " + nombre
          });
        }
      }else{
        this.candidatos = [];
      }
    })
  }

  mostrarEmpresas(){
    this.empresas = [];
    this.empresa_service.obtenerEmpresasPorIdCliente(this.id_cliente)
    .subscribe( (object : any) => {
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          this.empresas.push({
            "id_empresa_cliente" : object.data[i].id_empresa_cliente,
            "empresa" : object.data[i].empresa
          });
        }
      }else{
        this.empresas = [
          { "empresa" : "No existen empresas disponibles para este cliente"}
        ];
      }
    });
  }

  mostrarDepartamentos(){
    let valor = this.contrato.empresa.split(" ")[1];
    let object = this.empresas.filter( (x : any) => x.id_empresa_cliente === parseInt(valor))[0];
    this.contrato.empresa = object.empresa;
    this.contrato.id_empresa = object.id_empresa_cliente;
    this.bandera[0] = false;
    this.departamentos = [];
    let json = {
      "taken" : 999,
      "pagina" : 0,
      "status" : 2,
      "palabra" : "",
      "id_empresa" : this.contrato.id_empresa
    };
    this.departamento_service.obtenerDepartamentos(json)
    .subscribe( (object : any)=>{
      if(object.ok){
        for(let i=0;i<object.data.registros.length;i++){
          this.departamentos.push({
            "id_departamento" : object.data.registros[i].id_departamento,
            "departamento" : object.data.registros[i].departamento
          });
        }
      }else{
        this.departamentos = [];
      }
    });
  }

  mostrarPuestos(){
    let valor = this.contrato.departamento.split(" ")[1];
    let object = this.departamentos.filter( (x : any) => x.id_departamento === parseInt(valor))[0];
    this.contrato.departamento = object.departamento;
    this.contrato.id_departamento = object.id_departamento;
    this.bandera[1] = false;
    this.puestos = [];
    this.puesto_service.obtenerPuestosPorIdDepartamento(this.contrato.id_departamento)
    .subscribe( (object : any) => {
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          this.puestos.push({
            "id_puesto" : object.data[i].id_puesto,
            "puesto" : object.data[i].puesto,
            "sueldo_tipo_a" : object.data[i].sueldo_tipo_a,
            "sueldo_tipo_b" : object.data[i].sueldo_tipo_b,
            "sueldo_tipo_c" : object.data[i].sueldo_tipo_c,
          });
        }
      }else{
        this.puestos = [];
      }
    });
  }
  mostrarSueldos(){
    this.bandera[2] = false;  
    let valor = this.contrato.puesto.split(" ")[1];
    let object = this.puestos.filter( (x : any) => x.id_puesto === parseInt(valor))[0];
    this.contrato.puesto = object.puesto;
    this.contrato.id_puesto = object.id_puesto;
    this.contrato.sueldo = object.sueldo_tipo_c;
    this.sueldos = [object.sueldo_tipo_a,object.sueldo_tipo_b,object.sueldo_tipo_c];
  }

  agregarCandidato(){
    if(this.contrato.id_candidato != 0 && this.contrato.id_departamento != 0 &&
       this.contrato.id_puesto != 0 && this.contrato.sueldo != "0"){
         if(this.solicitud_contratos.length > 0){
          this.contrato.id_contrato = this.solicitud_contratos.length+1;
          let band_contrato = true;
          this.solicitud_contratos.forEach(solicitud => {
            if(solicitud.id_candidato == this.contrato.id_candidato){
                band_contrato = false;
            }
          });
          if(band_contrato){
            this.solicitud_contratos.push(this.contrato);
            this.contrato = new Contrato(0,"",0,"",0,"",0,"",0,"","0","",this.usuario_creacion);
          }else{
            Swal.fire("Tenemos un problema","El candidato no puede repetirse","warning");
          }
         }else{
          this.solicitud_contratos.push(this.contrato);
          this.contrato = new Contrato(0,"",0,"",0,"",0,"",0,"","0","",this.usuario_creacion);
         }
       }else{
        Swal.fire("Tenemos un problema","Primero llena los campos requeridos","warning");
       }
    
  }
  eliminarCandidato(id_contrado : any){
    this.solicitud_contratos.forEach((solicitud,index) => {
      if(solicitud.id_contrato == id_contrado){
        this.solicitud_contratos.splice(index,1);
      }
    })
  }
  crearMov(){
    if(this.solicitud_contratos.length > 0){
      let json = {
        id_empresa_cliente : this.id_cliente,
        detalle_contratacion : this.solicitud_contratos
      }
      this.contrato_service.altaMovContratacion(json)
      .subscribe( (object : any)=>{
        if(object.ok){
          this.cerrarModal();
          this.mostrarMovimientos();
          Swal.fire("Buen trabajo","El movimiento de contratacion se ha registrado con éxito","success");
        }else{
          Swal.fire("Ha ocurrido un errro",object.message,"error");
        }
      });
    }else{
      Swal.fire("Tenemos un problema","No se han agregado candidatos al movimiento","warning");
    }
  }
  cambiarSueldo(sueldo : any){
    this.contrato.sueldo = sueldo;
  }

  mostrarContratos(){

  }

  editar(folio : any){

  }

  nuevoContrato(){
    this.mostrarCandidatos();
    this.mostrarEmpresas();
    this.openModal();
  }

  busqueda() {

  }

  filtroStatus() { 
    
  }

  paginar(){
    this.paginas = [];
    let paginas_a_pintar = parseInt(this.total_registros+"")%parseInt(this.taken+"");
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
    this.pagina_actual = pagina;
    this.mostrarContratos();
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
}
