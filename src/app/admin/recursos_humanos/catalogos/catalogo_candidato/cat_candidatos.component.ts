import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-candidatos',
  templateUrl: './cat_candidatos.component.html',
  styleUrls: ['./cat_candidatos.component.css']
})
export class CatalogoCandidatosComponent implements OnInit {

  public color = COLOR;
  public estatus_color = "bg-dark";
  public status = "default";
  public foto_user : any;
  public docB64 = "";
  @ViewChild('file_input', {read: ElementRef}) foto : any;
  direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  fotografia : Fotografia = new Fotografia(0,"","","");
  cliente_id = parseInt(window.sessionStorage.getItem("cliente")+"");
  usuario_id = parseInt(window.sessionStorage.getItem("cliente")+"")
  empleado : Candidato = new Candidato(0,this.cliente_id,0,"","","","","","","","",0,"",0,0,0,"",this.usuario_id,this.direccion,this.fotografia);
  tabs = [
    {
      title : "Empleados",
      id_tab : "#empleado",
      clase : "active"
    },
    {
      title : "Direcciones",
      id_tab : "#direccion",
      clase : ""
    }
  ];
  colonias = [
    "Primero ingresa el Codigo Postal"
  ];

  constructor( 
    public cp_service: LocalidadService,
    private router: ActivatedRoute,
    private routers : Router,
    private candidato: CandidatoService,
    private usuario: UsuarioService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.foto_user = "../../../../../assets/img/defaults/usuario_por_defecto.svg";
    if(this.usuario.obtenerToken() == ""){
      this.routers.navigateByUrl("/login");
    }
    this.router.paramMap.subscribe((params : ParamMap) => {
      let valor = parseInt(params.get("id")+"");
      this.pintarDatos(valor);
    });
  }

  pintarDatos(valor : number){
  // let valor = parseInt(this.router.snapshot.paramMap.get("id")+"");
   if(valor >0){
     this.candidato.obtenerCandidatoPorId(valor)
     .subscribe( (object : any) => {
      if(object.ok){
        for(let i=0;i<object.data.length;i++){
          if(object.data[i].fotografia != ""){
            this.mostrarImagen(object.data[i].fotografia,object.data[i].extension);
          }
          this.fotografia.id_fotografia = object.data[i].cat_fotografia_id;
          this.cambiarEstatus(object.data[i].estatus);
          this.empleado.id = object.data[i].id;
          this.empleado.nombre = object.data[i].nombre;
          this.empleado.apellido_materno = object.data[i].apellido_materno;
          this.empleado.apellido_paterno = object.data[i].apellido_paterno;
          this.empleado.rfc = object.data[i].rfc;
          this.empleado.curp = object.data[i].curp;
          this.empleado.fecha_nacimiento = object.data[i].fecha_nacimiento;
          this.empleado.numero_social = object.data[i].numero_seguro;
          this.empleado.telefono = object.data[i].telefono;
          this.empleado.telefono_dos = object.data[i].telefono_dos;
          this.empleado.telefono_tres = object.data[i].telefono_tres;
          this.empleado.correo = object.data[i].correo;
          this.empleado.descripcion = object.data[i].descripcion;
          this.empleado.direccion.id_direccion = parseInt(object.data[i].id_direccion);
          this.direccion.calle = object.data[i].calle;
          this.direccion.numero_exterior = object.data[i].numero_exterior;
          this.direccion.numero_interior = object.data[i].numero_interior;
          this.direccion.cruzamiento_uno = object.data[i].cruzamiento_uno;
          this.direccion.cruzamiento_dos = object.data[i].cruzamiento_dos;
          this.direccion.codigo_postal = object.data[i].codigo_postal;
          this.colonias = [];
          this.colonias.push(object.data[i].colonia);
          this.direccion.localidad = object.data[i].localidad;
          this.direccion.municipio = object.data[i].municipio;
          this.direccion.estado = object.data[i].estado;
          this.direccion.descripcion = object.data[i].descripcion_direccion;
          this.accionContenedorActualizar(true);
          this.accionContenedorGuardar(false);
        }
      }else{
        swal.fire("Ha ocurrido un error","No se ha podido mostrar el candidato","error");
      }
    });
   }

  }
  generarEdad(){
    let convertAge = new Date(this.empleado.fecha_nacimiento+"");
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    let edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    this.empleado.edad = edad;
  }
  getDatos(){
    this.cp_service.getDirrecion(this.empleado.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.empleado.direccion.estado = data[0].response.estado;
        this.empleado.direccion.municipio = data[0].response.municipio;
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
  guardar(form_empleado : NgForm){
    if( form_empleado.invalid){
    }else{
      //Almacenar la fotografia
      this.fotografia.docB64 = this.docB64;
      this.fotografia.nombre = "foto_user";
      this.empleado.cat_clientes_id = parseInt(window.sessionStorage.getItem('cliente')+"");
      this.candidato.altaCandidato(this.empleado)
      .subscribe( (objeto : any ) => {
        if(objeto.ok){
          swal.fire("Buen trabajo",objeto.message,"success");
        }else{
          swal.fire("Ha ocurrido un error",objeto.message,"error");
        }
      });
    }
  }
  actualizar(){
    swal.fire({
      title: '¿Estas seguro?',
      text: "El candidato se actualizará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo actualizarlo',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidato.actualizarCandidato(this.empleado)
        .subscribe( (objeto : any ) => {
          if(objeto.ok){
            swal.fire("Buen trabajo",objeto.message,"success");
          }else{
            swal.fire("Ha ocurrido un error",objeto.message,"error");
          }
        });
      }
    })
  }
  modificarMunicipio(){
    let colonia = this.empleado.direccion.colonia;
    this.cp_service.getDirrecion(this.empleado.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.empleado.direccion.estado = data[i].response.estado;
            this.empleado.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }
  autocomplete(){
    swal.fire("autocomplete","cambio","success");
  }
  subirImagen(){
      document.getElementById("foto_user")?.click();
  }
  cambiarImagen(){
    let archivos = this.foto.nativeElement.files;
    let extension = archivos[0].name.split(".")[1];
    this.fotografia.extension = extension;
    if(extension == "jpg" || extension == "png"){
      this.convertirImagenAB64(archivos[0]).then( respuesta => {
        let img = "data:image/"+extension+";base64, "+respuesta;
        this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
        this.docB64 = respuesta+"";
        this.fotografia.docB64 = respuesta+"";
      });
    }else{
      swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
    }
  }
  mostrarImagen(docB64 : any, extension : any){
    let img = "data:image/"+extension+";base64, "+docB64;
    this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
    this.docB64 = docB64+"";
    this.fotografia.docB64 = docB64;
    this.fotografia.extension = extension;
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
  limpiar(){
    this.direccion = new Direccion(0,0,"","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","","");
    this.empleado = new Candidato(0,this.cliente_id,0,"","","","","","","","",0,"",0,0,0,"",this.usuario_id,this.direccion,this.fotografia);
    this.foto_user = "../../../../../assets/img/defaults/usuario_por_defecto.svg";
  }
  accionContenedorActualizar(band : any){
    let contenedor_actualizar = document.getElementById("actualizar");
    if(band == true){
      contenedor_actualizar?.setAttribute("style","display:inline;");
    }else{
      contenedor_actualizar?.setAttribute("style","display:none;");
    }
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
  eliminarCandidato(){
    swal.fire({
      title: '¿Estas seguro que deseas eliminar este candidato?',
      text: "Una vez eliminado, ya no podrás recuperarlo",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro.',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.candidato.eliminarCandidato(this.empleado.id)
        .subscribe ( (objecto : any) => {
          if(objecto.ok){
            swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
            this.routers.navigateByUrl("catalogo_candidato");
          }
      });
      }
    });
  }
}

