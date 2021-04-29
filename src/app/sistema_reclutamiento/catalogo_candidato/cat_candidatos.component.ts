import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-candidatos-original',
  templateUrl: './cat_candidatos.component.html',
  styleUrls: ['./cat_candidatos.component.css']
})
export class CatalogoCandidatosComponent implements OnInit {

  //Variables globales
  public color = COLOR;
  public direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public usuario_logueado = parseInt(window.sessionStorage.getItem("user")+"");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public candidato = new Candidato(0,this.id_cliente,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia); 
  public candidatos : any;
  public band = true;
  public modal : any;
  public estatus_color = "";
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public activo = true;
  public foto_user : any;
  public docB64 = "";
  //Filtros
  public taken = 5; //Registros por default
  public status = 2; //Status default
  public palabra = "";
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
  
  colonias = [
    "Primero ingresa el Codigo Postal"
  ];

  @ViewChild('file_input', {read: ElementRef}) foto : any;

  constructor( 
    public cp_service: LocalidadService,
    private candidato_service: CandidatoService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
  ) {
    this.foto_user = "./assets/img/defaults/usuario_por_defecto.svg";
   }

  ngOnInit(): void {
    this.mostrarCandidatos();
  }

  mostrarCandidatos(){
    let json = {
      palabra : this.palabra,
      taken : this.taken,
      status : this.status,
      pagina : this.pagina_actual,
      id_cliente : this.id_cliente
    };
    this.candidatos = [];
    this.candidato_service.obtenerCandidatos(json)
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
            let nombre = object.data.registros[i].nombre;
            let apellidos = object.data.registros[i].apellido_paterno + " " + object.data.registros[i].apellido_materno;
            this.candidatos.push({
              "folio" : object.data.registros[i].id_candidato,
              "nombre" : apellidos + " " + nombre,
              "status" : object.data.registros[i].status
            });
          }
        }else{
          this.band = false;
        }
    });
  }
  altaCandidato(){
    let band = true;
    if(this.candidato.apellido_paterno == "" || this.candidato.apellido_materno == "" || this.candidato.nombre == ""){
      Swal.fire("Ha ocurrido un error","Primero llena los campos requeridos","error");
    }else{
      if(
        this.direccion.calle == 0 && this.direccion.codigo_postal == "" &&
        this.direccion.colonia == "" && this.direccion.cruzamiento_dos == "" &&
        this.direccion.cruzamiento_uno == "" && this.direccion.descripcion ==  "" &&
        this.direccion.estado == "" && this.direccion.localidad == "" &&
        this.direccion.municipio == "" && this.direccion.numero_exterior == ""
        && this.direccion.numero_interior == ""
        ){
          Swal.fire({
            title: '¿Estas seguro de agregar una empresa sin ningun dato de dirección?',
            text: "El empresa se registrará sin domicilio, pero puedes actulizar su información en cualquier momento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, estoy seguro',
            cancelButtonText : "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              band = true;
            }else{
              band = false;
            }
          });
      }else{
        if(band){
          if(this.fotografia.docB64 == ""){
            Swal.fire({
              title: '¿Estas seguro de agregar al candidato sin ningun foto?',
              text: "El candidato se registrará sin foto, pero puedes actulizar su información en cualquier momento",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, estoy seguro',
              cancelButtonText : "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                band = true;
              }else{
                band = false;
              }
            });
          }else{
            if(band){
              this.candidato_service.altaCandidato(this.candidato)
              .subscribe( (object) =>{
                if(object.ok){
                  this.limpiarCampos();
                  this.mostrarCandidatos();
                  Swal.fire("Buen trabajo","La empresa se ha dado de alta correctamente","success");
                  this.cerrarModal();
                }else{
                  Swal.fire("Ha ocurrido un error",object.message,"error");
                }
              });
            }
          }
        }
      }
    }
  }

  limpiarCampos(){
    this.direccion  = new Direccion(0,0,"","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","",""); 
    this.candidato = new Candidato(0,this.id_cliente,"","","","","","","","",0,"","","","","",this.usuario_logueado,this.direccion,this.fotografia);
  }

  generarEdad(){
    let convertAge = new Date(this.candidato.fecha_nacimiento+"");
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    this.candidato.edad = edad;
  }
  getDatos(){
    this.cp_service.getDirrecion(this.candidato.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.candidato.direccion.estado = data[0].response.estado;
        this.candidato.direccion.municipio = data[0].response.municipio;
        this.colonias = [];
        for(let i=0;i<data.length;i++){
          this.colonias.push(data[i].response.asentamiento);
        }
      }
    },
    (error : any) => {
      swal.fire('Ha ocurrido un error','No se han encontrado resultados', 'warning');
    });
  }

  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
  }

  accionContenedorGuardar(band : any){
    let contenedor_actualizar = document.getElementById("guardar");
    if(band == true){
      contenedor_actualizar?.setAttribute("style","display:inline;");
    }else{
      contenedor_actualizar?.setAttribute("style","display:none;");
    }
  }

  cambiarEstatus(estatus : any){
    this.status = estatus;
    if(estatus == "En reclutamiento"){
      this.estatus_color = "bg-success";
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
      if(extension == "jpg" || extension == "png"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          let img = "data:image/"+extension+";base64, "+respuesta;
          this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
          this.docB64 = respuesta+"";
          this.fotografia.docB64 = respuesta+"";
          this.fotografia.extension = extension;
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
      }
    }
  }

  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'xl', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
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

  editar(folio : any){
  }

  guardar(){
    this.openModal();
  }

  irPagina(pagina : any){
    this.pagina_actual = pagina;
    // this.mostrarEmpresas();
  }

  filtroStatus(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    // this.mostrarEmpresas();
  }

  busqueda(){
    this.pagina_actual = 0;
    this.limite_inferior = 0;
    // this.mostrarEmpresas();
  }
  modificarMunicipio(){
    let colonia = this.candidato.direccion.colonia;
    this.cp_service.getDirrecion(this.candidato.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.candidato.direccion.estado = data[i].response.estado;
            this.candidato.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }
}

