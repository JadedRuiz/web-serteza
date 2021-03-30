import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import swal from'sweetalert2';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Cliente } from 'src/app/models/Cliente';
import { Direccion } from 'src/app/models/Direccion';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './cat_cliente.component.html',
  styleUrls: ['./cat_cliente.component.css']
})
export class CatalogoClienteComponent implements OnInit {

  public color = COLOR;
  tabs = [
    {
      title : "Cliente",
      id_tab : "#cliente",
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
  public id_user = parseInt(window.sessionStorage.getItem("sistema")+"");
  public id_user_dos = parseInt(window.sessionStorage.getItem("user")+"");
  direccion : Direccion = new Direccion(0,0,"","","","","","","","","","");
  cliente : Cliente = new Cliente(0,"",0,"",this.id_user,this.id_user_dos,this.direccion);

  constructor( 
    public cp_service: LocalidadService,
    private router: ActivatedRoute,
    private routers : Router,
    private usuario: UsuarioService,
    public cliente_service: ClienteService
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
    if(valor >0){
      this.cliente_service.obtenerClientesPorId(valor)
      .subscribe( (object : any) => {
        if(object.ok){
          this.cliente.id = object.data[0].id_cliente;
          this.cliente.cliente = object.data[0].cliente;
          this.cliente.contacto = object.data[0].contacto;
          this.cliente.descripcion = object.data[0].descripcion;
          this.direccion.id_direccion = object.data[0].id_direccion;
          this.direccion.calle = object.data[0].calle;
          this.direccion.numero_exterior = object.data[0].numero_exterior;
          this.direccion.numero_interior = object.data[0].numero_interior;
          this.direccion.cruzamiento_uno = object.data[0].cruzamiento_uno;
          this.direccion.cruzamiento_dos = object.data[0].cruzamiento_dos;
          this.direccion.codigo_postal = object.data[0].codigo_postal;
          this.colonias = [];
          this.colonias.push(object.data[0].colonia);
          this.direccion.localidad = object.data[0].localidad;
          this.direccion.municipio = object.data[0].municipio;
          this.direccion.estado = object.data[0].estado;
          this.direccion.descripcion = object.data[0].descripcion_direccion;
          this.accionContenedorActualizar(true);
          this.accionContenedorGuardar(false);
        }else{
          swal.fire("Ha ocurrido un error",object.message,"error");
        }
      });
      
    } 
  }
  getDatos(){
    this.cp_service.getDirrecion(this.cliente.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        this.cliente.direccion.estado = data[0].response.estado;
        this.cliente.direccion.municipio = data[0].response.municipio;
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
  guardar(form_cliente : NgForm){
    if( form_cliente.invalid){
    }else{
      this.cliente_service.altaCliente(this.cliente)
      .subscribe( (object : any)=>{
        console.log(object);
        if(object.ok){
          swal.fire('Buen trabajo', "Se ha guardado exitosamente", 'success');
          this.limpiar();
        }else{
          swal.fire('Ha ocurrido un error', "No se ha podido guardar el cliente", 'error');
        }
      });
    }
  }
  actualizar(){
    swal.fire({
      title: '¿Estas seguro?',
      text: "El cliente se actualizará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo actualizarlo',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cliente_service.actualizarCliente(this.cliente)
        .subscribe( (object : any) =>{
          if(object.ok){
            swal.fire(
              'Actualizado!',
              'El cliente ha sido actualizado',
              'success'
            );
          }else{
            swal.fire(
              'Ha ocurrido un error',
              'La empresa no ha podido ser actualizada',
              'error'
            );
          }
        });
      }
    })
  }
  eliminar(){
    swal.fire({
      title: '¿Estas seguro?',
      text: "El cliente se eliminará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro.',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cliente_service.eliminarCliente(this.cliente.id)
        .subscribe( (object : any) =>{
          if(object.ok){
            swal.fire(
              'Emilinado!',
              'El cliente ha sido eliminado',
              'success'
            );
            this.routers.navigateByUrl("/catalogo_cliente");
          }else{
            swal.fire(
              'Ha ocurrido un error',
              'La empresa no ha podido ser eliminada',
              'error'
            );
          }
        });
      }
    });
  }
  limpiar(){
    this.direccion  = new Direccion(0,0,"","","","","","","","","","");
    this.cliente  = new Cliente(0,"",0,"",this.id_user,this.id_user_dos,this.direccion);
  }
  modificarMunicipio(){
    let colonia = this.cliente.direccion.colonia;
    this.cp_service.getDirrecion(this.cliente.direccion.codigo_postal)
    .subscribe( (data: any) => {
      if(data.length > 0){
        for(let i=0;i<data.length;i++){
          if(data[i].response.asentamiento == colonia){
            this.cliente.direccion.estado = data[i].response.estado;
            this.cliente.direccion.municipio = data[i].response.municipio;
          }
        }
      }
    });
  }
  autocomplete(){
    swal.fire("autocomplete","cambio","success");
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
