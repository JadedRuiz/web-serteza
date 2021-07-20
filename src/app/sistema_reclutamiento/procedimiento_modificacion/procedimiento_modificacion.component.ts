import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Modificacion } from 'src/app/models/Modificacion';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import { ModificacionService } from 'src/app/services/Modificacion/Modificacion.service';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-procedimiento-modificacion',
  templateUrl: './procedimiento_modificacion.component.html',
  styleUrls: ['./procedimiento_modificacion.component.css']
})
export class ProcedimientoModificacionComponent implements OnInit {

  public color = COLOR;
  public status = -1;
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
  public band = false;
  public modificaciones : any;
  public tipo_modal = 0;
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
  public aplicar = false;
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
    observacion : "",
    id_detalle_modificacion : 0
  };

  constructor(
    private modalService: NgbModal,
    private candidato_service : CandidatoService,
    private contrato_service : ContratoService,
    private empresa_service : EmpresaService,
    private departamento_service : DepartamentoService,
    private puesto_service : PuestoService,
    private modificacion_service : ModificacionService,
    private usuario_service : UsuarioService
    ) { }

  ngOnInit(): void {
    this.mostrarModificacion();
  }

  mostrarModificacion(){
    this.modificaciones = [];
    let array = {
      id_cliente : this.id_cliente,
      fecha_inicial : this.fecha_inicial,
      fecha_final : this.fecha_final,
      id_status : this.status
    }
    this.usuario_service.tieneSistema({"usuario":this.usuario_creacion,"id_sistema" : "3"})
    .subscribe( (object : any) => {
      this.aplicar = true;
      if(object.ok){
        this.aplicar = false;
      }
    });
    this.modificacion_service.obtenerSolicitudesBaja(array)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.band = true;
        this.modificaciones = object.data;
      }else{
        this.band = false;
      }
    });
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
        observacion : "",
        id_detalle_modificacion : 0,
      };
      this.myControl.reset('');
    }else{
      Swal.fire("Ha ocurrido un error","Antes de agregar, realice una modificación","info");
    }
  }
  nuevoModi(){
    this.modificacion.candidatos = [];
    this.tipo_modal = 0;
    this.openModal();
  }
  crearModi(){
    if(this.modificacion.candidatos.length > 0){
      this.confirmar("Confirmación","¿Seguro que deseas crear una solicitud de modificación","info",null,1);
    }else{
      Swal.fire("Ha ocurrido un error","Primero agregue modificaciones a la tabla","info");
    }
  }

  modificarModi(){
    if(this.modificacion.candidatos.length > 0){
      this.confirmar("Confirmación","¿Seguro que deseas modificar una solicitud de modificación","info",null,2);
    }else{
      Swal.fire("Ha ocurrido un error","Primero agregue modificaciones a la tabla","info");
    }
  }

  editar(id : any, tipo : any){
    this.modificacion.candidatos = [];
    this.tipo_modal = tipo;
    this.modificacion_service.obtenerDetalleModificacion(id)
    .subscribe( (object : any) =>{
      if(object.ok){
        this.bandera = true;
        this.modificacion.id_movimiento = id;
        object.data.forEach( (element : any) => {
          this.modificacion.candidatos.push(element);
        });
      }else{
        this.modificacion.candidatos = [];
        this.bandera = false;
      }
    });
    this.openModal();
  }

  eliminarDetalle(id_detalle_modificacion : any, id_candidato : any){
      this.confirmar("Confirmación","¿Seguro que deseas eliminar este detalle?","info",{id_detalle_modificacion : id_detalle_modificacion, id_candidato : id_candidato},3);
  }

  eliminarFilaDetalle(id_candidato : any){
    this.modificacion.candidatos.forEach( (element : any , index : any) => {
      if(element.id_candidato == id_candidato){
        this.modificacion.candidatos.splice(index,1);
      }
    });
  }

  busqueda(event : any) {

  }

  irPagina(pagina : any){
    this.pagina_actual = pagina;
  }
  
  aplicarModificacion(id : any){
    this.confirmar("Confirmación","¿Seguro que deseas aplicar la modificación?","info",null,4);
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
        if(tipo == 1){  //Guardar
          this.modificacion_service.crearSolicitudDeModificacion(this.modificacion)
          .subscribe( (object : any)=>{
            if(object.ok){
              this.cerrarModal();
              this.mostrarModificacion();
              Swal.fire("Buen trabajo","Se ha creado la solicitud éxitosamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.modificacion_service.modificarDetalleModificacion(this.modificacion)
          .subscribe( (object : any) =>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha editado la solicitud éxitosamente","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
        if(tipo == 3){
          this.modificacion_service.eliminarDetalle(json.id_detalle_modificacion)
          .subscribe( (object : any)=>{
            if(object.ok){
              if(object.data){
                this.cerrarModal();
                this.mostrarModificacion();
                Swal.fire("Buen trabajo","Se ha eliminado la solicitud éxitosamente","success");
              }else{
                Swal.fire("Buen trabajo","Se ha eliminado el detalle éxitosamente","success");
              }
              this.eliminarFilaDetalle(json.id_candidato);
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
        if(tipo == 4){

        }
      }
    });
  }
}
