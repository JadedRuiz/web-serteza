import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Contrato } from 'src/app/models/Contrato';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';

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
  public contrato = new Contrato(0,0,0,0,0,"","0",this.usuario_creacion);
  public contratos : any;
  public modal : any;
  public taken = 5;
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

  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private puesto_service : PuestoService
  ) {
    this.modal = NgbModalRef;
   }

  ngOnInit(): void {
    
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
    console.log(this.contrato.id_empresa);
    if(this.contrato.id_empresa == 0){
      this.bandera[0] = true;
    }else{
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
  }

  mostrarPuestos(){
    if(this.contrato.id_departamento == 0){
      this.bandera[1] = true;
    }else{
      this.bandera[1] = false;
      this.puestos = [];
      console.log(this.contrato.id_departamento);
      this.puesto_service.obtenerPuestosPorIdDepartamento(this.contrato.id_departamento)
      .subscribe( (object : any) => {
        if(object.ok){
          for(let i=0;i<object.data.length;i++){
            this.puestos.push({
              "id_puesto" : object.data[i].id_puesto,
              "puesto" : object.data[i].puesto
            });
          }
        }else{
          this.puestos = [];
        }
      });
    }
    
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
