import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modificacion } from 'src/app/models/Modificacion';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procedimiento-modificacion',
  templateUrl: './procedimiento_modificacion.component.html',
  styleUrls: ['./procedimiento_modificacion.component.css']
})
export class ProcedimientoModificacionComponent implements OnInit {

  public color = COLOR;
  public status = 2;
  public palabra = "";
  public fecha_inicial = "";
  public fecha_final = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal : any;
  public candidatos : any;
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public usuario_creacion = parseInt(window.sessionStorage.getItem("user")+"");
  public modificacion = new Modificacion(0,0,this.id_cliente,this.usuario_creacion,[]);
  public bandera = false;
  //Autocomplete
  myControl = new FormControl();
  candidatos_busqueda : any;
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
  public taken = 5;
  public modificar = false;
  //Modificacion
  public nominas : any;
  public empresas : any;
  public departamentos : any;
  public puestos : any;
  public json = {
    nombre : "",
    id_candidato : 0,
    id_empresa : 0,
    id_departamento : 0,
    id_puesto : 0,
    id_nomina : 0,
    sueldo : "",
    fecha_modificacion : "",
    observacion : ""
  };

  constructor(
    private modalService: NgbModal,
    private candidato_service : CandidatoService,
    private contrato_service : ContratoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private puesto_service : PuestoService
    ) { }

  ngOnInit(): void {
  }

  mostrarCandidatos(value : any){
    this.candidatos = [];
    if(value.length > 3){
      let json = {
        palabra : value,
        taken : 5,
        status : 1,
        pagina : 0,
        id_cliente : this.id_cliente  
      };
      this.candidato_service.obtenerCandidatos(json)
      .subscribe( (object : any) => {
        if(object.ok){
          this.candidatos = object.data.registros;
        }else{
          this.candidatos = [];
        }
      });
    }else{
      this.candidatos = [];
    }
  }

  mostrarNominas(){
    this.nominas = [];
    this.contrato_service.obtenerCatalogoNomina()
    .subscribe( (object :any) =>{
      if(object.ok){
        this.nominas = object.data;
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
            "id_empresa" : object.data[i].id_empresa,
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
  
  cambiarEmpresa(){
    this.modificar = true;  //Hubo una modificación
    this.mostrarDepartamentos(this.json.id_empresa);
    this.json.id_departamento = 0;
    this.json.id_puesto = 0;
    this.puestos = [];
  }

  mostrarDepartamentos(id_empresa : any){
    this.departamentos = [];
    let json = {
      "taken" : 999,
      "pagina" : 0,
      "status" : 2,
      "palabra" : "",
      "id_empresa" : id_empresa
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

  cambiarDepartamento(){
    this.modificar = true;  //Hubo una modificación
    this.mostrarPuestos(this.json.id_departamento);
    this.json.id_puesto = 0;
  }

  mostrarPuestos(id_departamento : any){
    this.puestos = [];
    this.puesto_service.obtenerPuestosPorIdDepartamento(id_departamento)
    .subscribe( (object : any) => {
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          let band = true;
          if(object.data[i].vacantes == "0"){
            band = false;
          }
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

  getCandidato(event : any){
    this.candidato_service.obtenerCandidatoActivoId(event.option.id)
    .subscribe( (object : any) => {
      this.bandera = true;
      this.json.nombre = event.option.value;
      this.json.id_candidato = event.option.id;
      this.json.sueldo = object.data[0].sueldo;
      this.json.id_nomina = object.data[0].id_nomina;
      this.json.id_empresa = object.data[0].id_empresa;
      this.mostrarDepartamentos(object.data[0].id_empresa);
      this.json.id_departamento = object.data[0].id_departamento;
      this.mostrarPuestos(object.data[0].id_departamento)
      this.json.id_puesto = object.data[0].id_puesto;
    });
  }

  agregarModificacion(){
    if(this.modificar){
      let band = false;
      this.modificacion.candidatos.forEach( (element : any) => {
        if(element.id_candidato == this.json.id_candidato){
          band = true;
        }
      });
      if(!band){
        this.modificacion.candidatos.push(this.json);
      }else{
        Swal.fire("Ha ocurrido un error","No se puede agregar a un mismo empleado","info");
      }
      this.json = {
        nombre : "",
        id_candidato : 0,
        id_empresa : 0,
        id_departamento : 0,
        id_puesto : 0,
        id_nomina : 0,
        sueldo : "",
        fecha_modificacion : "",
        observacion : ""
      };
      this.myControl.reset('');
    }else{
      Swal.fire("Ha ocurrido un error","Antes de agregar, realice una modificación","info");
    }
  }

  crearModi(){
    if(this.modificacion.candidatos.length > 0){
      console.log(this.modificacion);
    }else{
      Swal.fire("Ha ocurrido un error","Primero agregue modificaciones a la tabla","info");
    }
  }

  busqueda(event : any) {

  }

  irPagina(pagina : any){
    this.pagina_actual = pagina;
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

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
    this.mostrarNominas();
    this.mostrarEmpresas();
  }

  cerrarModal(){
    this.modal.close();
  }
}
