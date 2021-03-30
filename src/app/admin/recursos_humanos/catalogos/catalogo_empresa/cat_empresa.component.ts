import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Empresa } from 'src/app/models/Empresa';
import { Direccion } from 'src/app/models/Direccion';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { Fotografia } from 'src/app/models/Fotografia';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-candidatos',
  templateUrl: './cat_empresa.component.html',
  styleUrls: ['./cat_empresa.component.css']
})
export class CatalogoEmpresaComponent implements OnInit {

  public color = COLOR;
  public id_user = parseInt(window.sessionStorage.getItem("sistema")+"");
  public id_user_dos = parseInt(window.sessionStorage.getItem("user")+"");
  fotografia : Fotografia = new Fotografia(0,"","","");
  direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  empresa : Empresa = new Empresa(0,0,this.id_user_dos,"","","","",this.id_user,this.direccion,this.fotografia);
  @ViewChild('file_input', {read: ElementRef}) foto : any;
  public foto_user : any;
  public docB64 = "";
  tabs = [
    {
      title : "Empresa",
      id_tab : "#empresa",
      clase : "active"
    },
    {
      title : "Dirección",
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
    private usuario: UsuarioService,
    private empresa_service : EmpresaService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.foto_user = "../../../../../assets/img/defaults/imagen-no-disponible.png";
    if(this.usuario.obtenerToken() == ""){
      this.routers.navigateByUrl("/login");
    }
    this.router.paramMap.subscribe((params : ParamMap) => {
      let valor = parseInt(params.get("id")+"");
      this.pintarDatos(valor);
    });
  }

  pintarDatos(valor : number){
  //  let valor = parseInt(this.router.snapshot.paramMap.get("id")+"");
    if(valor >0){
        this.empresa_service.obtenerEmpresaPorId(valor)
        .subscribe( (object : any) => {
          if(object.ok){
            this.fotografia.id_fotografia = object.data.fotografia_id;
            if(object.data.fotografia != ""){
              this.mostrarImagen(object.data.fotografia,object.data.extension);
            }
            this.empresa.id = object.data.id;
            this.empresa.rfc = object.data.rfc;
            this.empresa.empresa = object.data.empresa;
            this.empresa.razon_social = object.data.razon_social;
            this.empresa.descripcion = object.data.descripcion;
            this.direccion.id_direccion = object.data.id_direccion;
            this.direccion.calle = object.data.calle;
            this.direccion.numero_exterior = object.data.numero_exterior;
            this.direccion.numero_interior = object.data.numero_interior;
            this.direccion.cruzamiento_uno = object.data.cruzamiento_uno;
            this.direccion.cruzamiento_dos = object.data.cruzamiento_dos;
            this.direccion.codigo_postal = object.data.codigo_postal;
            this.colonias = [];
            this.colonias.push(object.data.colonia);
            this.direccion.localidad = object.data.localidad;
            this.direccion.municipio = object.data.municipio;
            this.direccion.estado = object.data.estado;
            this.direccion.descripcion = object.data.descripcion_direccion;
            this.accionContenedorActualizar(true);
            this.accionContenedorGuardar(false);
          }else{
            swal.fire("Ha ocurrido un error","No se ha podido mostrar la empresa","error");
          }
        });
    } 
  }
  getDatos(){
    this.cp_service.getDirrecion(this.empresa.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.empresa.direccion.estado = data[0].response.estado;
        this.empresa.direccion.municipio = data[0].response.municipio;
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
  guardar(form_empresa : NgForm){
    console.log(this.id_user);
    if( form_empresa.invalid){
      
    }else{
      this.empresa_service.altaEmpresa(this.empresa)
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
      text: "La empresa se actualizará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo actualizarlo',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresa_service.actualizarEmpresa(this.empresa)
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
  bajaEmpresa(){
    swal.fire({
      title: '¿Estas seguro?',
      text: "La empresa se eliminará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro.',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresa_service.bajaEmpresa(this.empresa.id)
        .subscribe ( (objecto : any) => {
          if(objecto.ok){
            swal.fire(
              'Emilinado!',
              'La empresa  ha sido eliminada',
              'success'
            );
            this.routers.navigateByUrl("catalogo_empresa");
          }
      });
      }
    });
  }
  modificarMunicipio(){
    let colonia = this.empresa.direccion.colonia;
    this.cp_service.getDirrecion(this.empresa.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.empresa.direccion.estado = data[i].response.estado;
            this.empresa.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }
  limpiar(){
    this.direccion = new Direccion(0,0,"","","","","","","","","","");
    this.fotografia = new Fotografia(0,"","","");
    this.empresa = new Empresa(0,0,this.id_user_dos,"","","","",0,this.direccion,this.fotografia);
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
}
