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
  @ViewChild('file_input', {read: ElementRef}) foto : any;
  direccion : Direccion = new Direccion(0,"","","","","","","","","","");
  cliente_id = parseInt(window.sessionStorage.getItem("cliente")+"");
  usuario_id = parseInt(window.sessionStorage.getItem("cliente")+"")
  empleado : Candidato = new Candidato(0,this.cliente_id,0,"","","","","","","","",0,"",0,0,0,"",this.usuario_id,this.direccion);
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
  //  let valor = parseInt(this.router.snapshot.paramMap.get("id")+"");
  //  if(valor >0){
  //    let json = this.empleados.getEmpleadosById(valor);
  //    this.colonias = [json.direccion.colonia+""];
  //    this.empleado = json;
  //  } 
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
      console.log("entro");
      this.candidato.altaCandidato(this.empleado)
      .subscribe( (objeto : any ) => {
        if(objeto.ok){
          console.log(objeto);
        }else{
          swal.fire("Ha ocurrido un error",objeto.message,"error");
        }
      });
    }
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
    if(extension == "jpg" || extension == "png"){
      this.convertirImagenAB64(archivos[0]).then( respuesta => {
        let img = "data:image/"+extension+";base64, "+respuesta;
        this.foto_user = this.sanitizer.bypassSecurityTrustResourceUrl(img);
      });
    }else{
      swal.fire("Ha ocurrido un error","Tipo de imagen no permitida","error");
    }
    
    
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
  
}

