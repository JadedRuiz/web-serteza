import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { COLOR } from 'src/config/config';
import { BancoService } from 'src/app/services/bancos/banco.service';
import { Banco } from 'src/app/models/Banco';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { FormControl} from '@angular/forms';


@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  styleUrls: []
})

export class BancosComponent implements OnInit {
  public color = COLOR;
  public palabra = "";
  public status = 2;
  public bancos : any;
  public taken = 5;
  public band = false;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  public banco = new Banco(0, this.empresa,0,"","","","","","",this.usuario);
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
  //Autocomplete
  //Autocomplete
  myControl = new FormControl();
  bancos_busqueda : any;
  

  constructor(
    
    private banco_service: BancoService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.traerBancos()
  }

  traerBancos() {
    let json = {
      "id_catbanco" : 0,
      "id_empresa" : this.empresa,
      "taken" : this.taken,
      "pagina" : this.pagina_actual,
      "palabra" : this.palabra
    };

    this.bancos = [];
    this.banco_service.obtenerBancos(json)
    .subscribe( (object : any) =>{
        if(object.ok){
          //Mostrar si los registros son mayores a los registros que se muestran
          this.total_registros = object.data.total;
          if(this.total_registros > this.taken){
            this.mostrar_pagination = true;
            this.paginar();
          }else{
            this.mostrar_pagination = false;
          }
          //Mostrar usuarios
          this.band = true;
          //LLenar los usuarios en la tabla
          for(let i =0; i<object.data.registros.length; i++){
            
            this.bancos.push({
              
              "id_catbanco" : object.data.registros[i].id_catbanco,
              "id_empresa" : object.data.registros[i].id_empresa,
              "id_bancosat" : object.data.registros[i].id_bancosat,
              "cuenta" : object.data.registros[i].cuenta,
              "tarjeta" : object.data.registros[i].tarjeta,
              "clabe" : object.data.registros[i].clabe,
              "contrato" : object.data.registros[i].contrato,
              "cuentacontable" : object.data.registros[i].cuentacontable,
              "descripcion" : object.data.registros[i].descripcion,
              "banco" : object.data.registros[i].banco,
              "usuario_creacion" : object.data.registros[i].usuario_creacion
            });
          }
        }else{
          this.band = false;
        }
    });
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
  
  autocomplete(palabra : string){
    this.bancos_busqueda = [];
    if(palabra.length > 3){
      this.banco_service.autoCompleteBanco({"nombre_departamento":palabra,"id_empresa":this.empresa})
      .subscribe((object : any) => {
        if(object.ok){
          this.bancos_busqueda = object.data;
        }else{
          this.bancos_busqueda = [];
        }
      })
    }
  }

  altaBancos(){
    
  }

  guardar(){
    this.openModal();
    this.tipo_modal = 1;
    this.band_puestos = false;
  }

  agregarBancos(){
    
  }

  eliminarBancos(folio : any){
    
    
  }

  cambiarValor( folio : any, valor_original : any ){
    
  }

  editar(folio : any){
    
  }

  editarBancos(id : any){
    
  }

  limpiaTexto(){
    
  }

  getBancos(event : any) {
    
  }

  busqueda(value : string){
    if(value.length > 3){
      this.autocomplete(value);
    }
  }

  limpiarCampos(){
    
  }



  irPagina(pagina : any){
    this.pagina_actual = pagina;
    this.traerBancos();
  }

  openModal() {
    this.limpiarCampos();
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number){

  }

}



