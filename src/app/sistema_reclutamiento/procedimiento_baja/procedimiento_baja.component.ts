import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { COLOR } from 'src/config/config';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-procedimiento-baja',
  templateUrl: './procedimiento_baja.component.html',
  styleUrls: ['./procedimiento_baja.component.css']
})
export class ProcedimientoBajaComponent implements OnInit {
  
  public color = COLOR;
  public status = 2;
  public palabra = "";
  public fecha_inicial = "";
  public fecha_final = "";
  public bajas : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal : any;
  public candidatos : any;
  public candidatos_seleccionados : any;
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  myControl = new FormControl();
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
    private candidato_service: CandidatoService) { 
      this.candidatos_seleccionados = [];
    }

  ngOnInit(): void {
    this.mostrarBajas();
  }
  
  mostrarBajas(){
    this.bajas = [];
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
    this.candidatos_seleccionados.push({
      "id_candidato" : event.option.id,
      "nombre" :  event.option.value,
      "fecha_baja" : "",
      "observacion" : ""
    });
    this.candidatos.splice(0,this.candidatos.length);
    this.myControl.reset('');
  }

  crearBaja(){
    console.log(this.candidatos_seleccionados);
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
  }

  cerrarModal(){
    this.modal.close();
  }
}
