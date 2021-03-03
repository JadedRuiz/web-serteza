import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { EmpleadoService } from 'src/app/services/Empleado/empleado.service';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Empleado } from 'src/app/models/empleado';
import { Direccion } from 'src/app/models/Direccion';

@Component({
  selector: 'app-recursos-humanos',
  templateUrl: './recursos_humanos.component.html',
  styleUrls: ['./recursos_humanos.component.css']
})
export class RecursosHumanosComponent implements OnInit {

  public color = COLOR;
  direccion : Direccion = new Direccion(0,"","","","","","","","","","");
  empleado : Empleado = new Empleado(0,"","","","","","","",0,"","","","","","",this.direccion);
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
    private empleados: EmpleadoService,
    private usuario: UsuarioService
  ) { }

  ngOnInit(): void {
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
     let json = this.empleados.getEmpleadosById(valor);
     this.colonias = [json.direccion.colonia+""];
     this.empleado = json;
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
      swal.fire('Bien hecho', "Se ha guardado exitosamente", 'success');
      console.log(this.empleado);
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
}
