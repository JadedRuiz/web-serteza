import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Usuario }  from 'src/app/models/Usuario'
import { UsuarioService} from 'src/app/services/Usuario/usuario.service'; 
import { Router } from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { asapScheduler } from 'rxjs';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public color = COLOR;
  usuario: Usuario = new Usuario(0,"","","","",0);
  sistemas : any;
  empresas : any;
  clientes : any;
  sistema_elegido = "";
  disabled_empresa = true;
  disabled_cliente = true;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  modal: any;
  active:string = "";
  public tipo_arreglo = 0;

  constructor( 
    public usuario_service : UsuarioService,
    private router : Router,
    private modalService: NgbModal,
    private cliente_service: ClienteService,
    private empresa : EmpresaService
    ) { 
      this.modal = NgbModalRef;
    }

  ngOnInit(): void {
    //Si existen variables de sesion las iniciamos
  }
  public login(f : NgForm){
    if(f.invalid){
      return ;
    }else{
      let respuesta = this.usuario_service.login(this.usuario);
      respuesta.subscribe((resp: any) => {
        if(resp.ok){
          this.tipo_arreglo = 0;
          this.sistemas = [];
          this.sistema_elegido = "";
          window.sessionStorage["user"] = resp.data.info_usuario.id;
          window.sessionStorage["nombre"] = resp.data.info_usuario.nombre;
          window.sessionStorage["foto"] = resp.data.info_usuario.url_foto;
          if(resp.data.info_usuario.sistemas.length > 1){ //Tiene más de un sistema
            for(let i=0; i<resp.data.info_usuario.sistemas.length; i++){
              let json = {
                sistema : resp.data.info_usuario.sistemas[i].sistema+"",
                id : resp.data.info_usuario.sistemas[i].id+""
              };
              this.sistemas.push(json);
            } 
            this.openModal();
          }else{
            this.sistema_elegido = resp.data.info_usuario.sistemas[0].id;
            window.sessionStorage["sistema"] = this.sistema_elegido;
            this.eleccion(this.sistema_elegido);
          }
        }else{
          Swal.fire("Ha ocurrio un error",resp.data,"error");
        }
      });      
    }
  }
  eleccion(id : any){
    this.sistema_elegido = id;
    window.sessionStorage["sistema"] = this.sistema_elegido;
    if(this.sistema_elegido == "5"){
      this.router.navigate(["sistema_super_admin/dashboard"]);
    }
    if(this.sistema_elegido == "1" || this.sistema_elegido == "6"){
      this.closeModal();
      this.empresas = [];
      this.empresa.obtenerEmpresaPorIdUsuario(window.sessionStorage["user"])
      .subscribe( (object : any) => {
        if(object.ok){
          this.tipo_arreglo = 1;
          // window.sessionStorage["foto_user"] = "";
          if(object.data.length > 1){
            object.data.forEach( (dato : any) => {
              this.empresas.push({
                "id_empresa" : dato.id_empresa,
                "empresa" : dato.empresa
              });
            });
            this.openModal();
          }else{
            window.sessionStorage["empresa"] = object.data[0].id_empresa;
            this.redirigirPrincipal(object.data[0].id_empresa);
          }
        }else{
          Swal.fire("Ha ocurrido un error","Este usuario no cuenta empresas para administrar","error");
        }
      });
    }
    if(this.sistema_elegido == "2"){
      this.closeModal();
      this.clientes = [];
      this.cliente_service.obtenerClientePorIdUsuario(window.sessionStorage["user"])
      .subscribe( (object : any) => {
        if(object.ok){
          if(object.data.length > 1){
            this.tipo_arreglo = 2;
            object.data.forEach( (dato : any) => {
              this.clientes.push({
                "id_cliente" : dato.id_cliente,
                "cliente" : dato.cliente
              });
            });
            this.openModal();
          }else{
            window.sessionStorage["cliente"] = object.data[0].id_cliente;
            this.redirigirPrincipal(object.data[0].id_cliente);
          }
        }else{
          Swal.fire("Ha ocurrido un error","Este usuario no cuenta con clientes","error");
        }
      });
    }
    
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
  redirigirPrincipal(id : any){
    if(this.sistema_elegido == "1"){
      window.sessionStorage["empresa"] = id;
      this.closeModal();
      this.router.navigate(["sistema_admin/dashboard"]);
    }
    if(this.sistema_elegido == "2"){
      window.sessionStorage["cliente"] = id;
      this.closeModal();
      this.router.navigate(["sistema_reclutamiento/dashboard"]);
    }
    if(this.sistema_elegido == "3"){
      this.router.navigate(["sistema_nomina/dashboard"]);
    }
    if(this.sistema_elegido == "4"){
      this.router.navigate(["sistema_control/dashboard"]);
    }
    if(this.sistema_elegido == "6"){
      this.router.navigate(["contabilidad/dashboard"]);
    }
  }
}
