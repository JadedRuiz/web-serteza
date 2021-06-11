import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { DepartamentoService } from 'src/app/services/Departamento/Departamento.service';
import { PuestoService } from 'src/app/services/Puesto/Puesto.service';
import { Departamento } from 'src/app/models/Departamento';
import { Puesto } from 'src/app/models/Puesto';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogo-departamento',
  templateUrl: './catalogo_departamento.component.html',
  styleUrls: ['./catalogo_departamento.component.css']
})
export class CatalogoDepartamentoComponent implements OnInit {

  public color = COLOR;
  public palabra = "";
  public status = 2;
  public departamentos : any;
  public taken = 5;
  public band = false;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  public departamento = new Departamento(0,this.empresa,"","",1,this.usuario,1,[]);
  public puesto = new Puesto(0,"","","","","1","",this.usuario,1);
  public puestos : any;
  public activo = true;
  public modal : any;
  public band_puestos = false;
  public cont = 0;
  public tipo_modal = 1;
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

  constructor(
    private departamento_service : DepartamentoService,
    private modalService: NgbModal,
    private puesto_service : PuestoService
  ) {
    this.puestos = []; 
    this.modal = NgbModalRef;
  }

  ngOnInit(): void {
    this.mostrarDepartamentos();
  }

  mostrarDepartamentos(){
    this.departamentos = [];
    let json = {
      "taken" : this.taken,
      "pagina" : this.pagina_actual,
      "status" : this.status,
      "palabra" : this.palabra,
      "id_empresa" : this.empresa
    };
    this.departamento_service.obtenerDepartamentos(json)
    .subscribe( (object : any)=>{
      if(object.ok && object.data.registros.length > 0){
        //Mostrar si los registros son mayores a los registros que se muestran
        this.total_registros = object.data.total;
        if(this.total_registros > this.taken){
          this.mostrar_pagination = true;
          this.paginar();
        }else{
          this.mostrar_pagination = false;
        }
        this.band = true;
        for(let i =0; i<object.data.registros.length; i++){
          status = "Inactivo";
          if(object.data.registros[i].activo == "1"){
            status = "Activo";
          }
          this.departamentos.push({
            "folio" : object.data.registros[i].id_departamento,
            "departamento" : object.data.registros[i].departamento,
            "vacantes" : object.data.registros[i].vacantes,
            "autorizados" : object.data.registros[i].autorizados,
            "status" : status
          });
        }
      }else{
        this.band = false;
      }
    });
  }

  altaDepartamento(){
    this.departamento.puestos = this.puestos;
    this.departamento.activo = 0;
    if(this.activo){
      this.departamento.activo = 1;
    }
    if(this.departamento.departamento != "" && this.departamento.disponibilidad > 0){
      if(this.puestos.length > 0){
        if(this.tipo_modal == 1){
          this.departamento_service.altaDepartamento(this.departamento)
          .subscribe( (object : any)=>{
            if(object.ok){
              this.cerrarModal();
              this.mostrarDepartamentos();
              Swal.fire("Buen trabajo","Se ha agregado el departamento con éxito","success");
              this.limpiarCampos();
            }
          });
        }
        if(this.tipo_modal == 2){
          this.departamento_service.actualizarDepartamento(this.departamento)
          .subscribe( (object : any)=>{
            if(object.ok){
              this.mostrarDepartamentos();
              Swal.fire("Buen trabajo","Se ha modificado el departamento con éxito","success");
            }
          });
        }
      }else{
        Swal.fire("Ha ocurrido un error","El departamento debe tener almenos un puesto","error");
      }
    }else{
      Swal.fire("Ha ocurrido un error","Debes llenar los campor obligatorios","error");
    }
  }

  guardar(){
    this.openModal();
    this.tipo_modal = 1;
    this.band_puestos = false;
  }

  agregarPuesto(){
    //validar la sumatoria de los puestos
    let sumatoria = 0;
    for(let i=0;i<this.puestos.length;i++){
      sumatoria += parseInt(""+this.puestos[i].disponibilidad);
    }
    this.departamento.disponibilidad = sumatoria + parseInt(""+this.puesto.disponibilidad);
      this.band_puestos = true;
      this.puestos.push({
        "id_puesto" : this.cont,
        "puesto" : this.puesto.puesto,
        "descripcion" : this.puesto.descripcion,
        "disponibilidad" : this.puesto.disponibilidad,
        "sueldo_tipo_a" : this.puesto.sueldo_tipo_a,
        "sueldo_tipo_b" : this.puesto.sueldo_tipo_b,
        "sueldo_tipo_c" : this.puesto.sueldo_tipo_c
      });
      this.cont++;
      this.puesto = new Puesto(0,"","","","","1","",this.usuario,1);
  }

  eliminarPuesto(folio : any){
    Swal.fire({
      title: '¿Estas seguro de eliminar el puesto?',
      text: "El puesto eliminado, ya no podrá ser recuperado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        for(let i=0;i<this.puestos.length;i++){
          if(this.puestos[i].id_puesto == folio){
            this.departamento.disponibilidad -= this.puestos[i].disponibilidad;
            this.puestos.splice(i,1);
          }
        }
        if(this.tipo_modal == 2){
          this.puesto_service.eliminarPuesto(folio)
          .subscribe( (object : any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha eliminado el puesto éxitosamente","success");
            }
          });
        }
      }
    });
    
  }

  cambiarValor( folio : any, valor_original : any ){
    let valor = jQuery("#valor_"+folio).val();
    this.departamento.disponibilidad -= valor_original;
    for(let i=0;i<this.puestos.length;i++){
      if(this.puestos[i].id_puesto == folio){
        this.puestos[i].disponibilidad = valor;
        this.departamento.disponibilidad += parseInt(valor+"");
      }
    } 
  }

  editar(folio : any){
    this.tipo_modal = 2;
    this.departamento_service.obtenerDepartamentoPorId(folio)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.openModal();
        this.band_puestos = true;
        this.puestos = object.data[0].puestos;
        this.departamento.id_departamento = object.data[0].id_departamento;
        this.departamento.departamento = object.data[0].departamento;
        this.departamento.descripcion = object.data[0].descripcion;
        this.departamento.disponibilidad = object.data[0].autorizados;
        if(object.data[0].activo == "1"){
          this.activo = true;
        }else{
          this.activo = false;
        }
      }
    });
  }

  editarPuesto(id : any){
    jQuery("#guardaPuesto").show();
    jQuery("#limpiaTexto").show();
    jQuery("#agregarPuesto").hide();
    this.puestos.forEach( (element : any) => {
      if(element.id_puesto == id){
        this.puesto.puesto = element.puesto;
        this.puesto.disponibilidad = element.autorizados;
        this.puesto.descripcion = element.descripcion;
        this.puesto.sueldo_tipo_a = element.sueldo_tipo_a;
        this.puesto.sueldo_tipo_b = element.sueldo_tipo_b;
        this.puesto.sueldo_tipo_c = element.sueldo_tipo_c;
      }
    });
  }

  limpiaTexto(){
    jQuery("#guardaPuesto").hide();
    jQuery("#limpiaTexto").hide();
    jQuery("#agregarPuesto").show();
    this.puesto = new Puesto(0,"","","","","1","",this.usuario,1);
  }

  filtroStatus(){
    this.mostrarDepartamentos();
  }

  busqueda(){
    this.mostrarDepartamentos();
  }

  limpiarCampos(){
    this.departamento = new Departamento(0,this.empresa,"","",0,this.usuario,1,[]);
    this.puesto = new Puesto(0,"","","","","1","",this.usuario,1);
    this.puestos = [];
    this.cont = 0;
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
    this.mostrarDepartamentos();
  }

  openModal() {
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
}
