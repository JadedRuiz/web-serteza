import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { COLOR } from 'src/config/config';
import { FormControl} from '@angular/forms';
import Swal from 'sweetalert2';
import { Baja } from 'src/app/models/Baja';
import { BajaService } from 'src/app/services/Baja/Baja.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-procedimiento-baja',
  templateUrl: './procedimiento_baja.component.html',
  styleUrls: ['./procedimiento_baja.component.css']
})
export class ProcedimientoBajaComponent implements OnInit {
  
  public color = COLOR;
  public status = -1;
  public palabra = "";
  public fecha_inicial = "";
  public fecha_final = "";
  public bajas : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  @ViewChild('editar', {static: false}) contenidoDelModalEditar : any;
  public modal : any;
  public candidatos : any;
  public candidatos_seleccionados : any;
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public usuario_creacion = parseInt(window.sessionStorage.getItem("user")+"");
  myControl = new FormControl();
  public candidatos_dos = new Baja(0,0,this.id_cliente,this.usuario_creacion,[]);
  public aplicar = false;
  public tipo_titulo = 1;
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
  //

  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
    private baja_service : BajaService,
    private usuario_service : UsuarioService
    ) { 
      this.candidatos_seleccionados = [];
    }

  ngOnInit(): void {
    this.mostrarBajas();
  }
  
  mostrarBajas(){
    this.bajas = [];
    let json = {
      "id_cliente" : this.id_cliente,
      "fecha_inicio"  :this.fecha_inicial,
      "fecha_fin" : this.fecha_final,
      "id_status" : this.status,
    };
    this.usuario_service.tieneSistema({"usuario":this.usuario_creacion,"id_sistema" : "3"})
    .subscribe( (object : any) => {
      this.aplicar = true;
      if(object.ok){
        this.aplicar = false;
      }
    });
    this.baja_service.obtenerSolicitudesBaja(json)
    .subscribe ( (object : any) => {
      if(object.ok){
        this.bajas = object.data;
      }else{
        this.bajas = [];
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

  getCandidato(event : any){
    let band = false;
    this.candidatos_dos.candidatos.forEach( (candidato:any) => {
      if(candidato.id_candidato == event.option.id){
        band = true;
      }
    });
    if(!band){
      this.candidatos_dos.candidatos.push({
        "id_candidato" : event.option.id,
        "nombre" :  event.option.value,
        "fecha_baja" : "",
        "observacion" : ""
      });
    }else{
      Swal.fire("Ha ocurrido un error","El empleado ya se encuentra agregado","info");
    }
    this.candidatos.splice(0,this.candidatos.length);
    this.myControl.reset('');
  }

  crearBaja(){
    this.confirmar("Confirmación","¿Seguro que desea generar la baja?","info",1,null);
  }
  modificarBaja(){
    this.confirmar("Confirmación","¿Seguro que desea modfiicar la baja?","info",2,null);
  }
  aplicarBaja(id : any){
    this.confirmar("Confirmación","¿Seguro que desea aplicar la baja?","info",4,id);
  }
  editarMovimientoBaja(id : any, tipo : any){
    this.tipo_titulo = tipo;
    this.candidatos_dos.id_movimiento = parseInt(id);
    this.candidatos_dos.candidatos = [];
    this.baja_service.obtenerDetalleSolicitudBaja(id)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.candidatos_dos.candidatos = object.data;
        this.openModalEditar();
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"info");
      }
    });
  }
  eliminarDetalle(id_detalle : any,id_candidato : any){
    this.confirmar("Confirmación","¿Seguro que desea eliminarlo?","info",3,{id_detalle : id_detalle,id_candidato : id_candidato});
  }
  eliminarDetalleSolicitud(id_candidato : any){
    this.candidatos_dos.candidatos.forEach( (element : any , index : any) => {
      if(element.id_candidato == id_candidato){
        this.candidatos_dos.candidatos.splice(index,1);
      }
    });
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
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
    this.candidatos_dos.candidatos = [];
  }
  openModalEditar() {
    this.modal = this.modalService.open(this.contenidoDelModalEditar,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }
  cerrarModal(){
    this.modal.close();
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number,data : any){
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
          console.log(this.candidatos_dos);
          this.baja_service.crearSolicitudDeBaja(this.candidatos_dos)
          .subscribe( (object : any) => {
            if(object.ok){
              Swal.fire("Buen trabajo","La solicitud de baja se ha generado con éxito","success");
              this.cerrarModal();
              this.mostrarBajas();
            }else{
              Swal.fire("Ha ocurrido un error","No se ha podido crear la solicitud","info");
            }
          });
        }
        if(tipo == 2){  //Editar
          this.baja_service.modificarDetalleSolicitud(this.candidatos_dos)
          .subscribe( (object:any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","La solicitud de baja se ha generado con éxito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
        if(tipo == 3){  //Eliminar Detalle
          this.baja_service.eliminarDetalle(data.id_detalle)
          .subscribe( (object : any) => {
            if(object.ok){
              if(object.data){
                this.cerrarModal();
                this.mostrarBajas();
              }else{
                this.eliminarDetalleSolicitud(data.id_candidato);
              }
              Swal.fire("Buen trabajo","Se ha eliminado con éxito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
        if(tipo == 4){  //Aplicar baja
          this.baja_service.aplicarBaja(data)
          .subscribe( (object  : any)=>{
            if(object.ok){
              this.mostrarBajas();
              Swal.fire("Buen trabajo","Se ha aplicado la baja con éxito","success");
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"info");
            }
          });
        }
      }
    });
  }
}
