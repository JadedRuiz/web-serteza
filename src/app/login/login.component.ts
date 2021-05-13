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
  sistema_elegido = "";
  disabled_empresa = true;
  disabled_cliente = true;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  modal: any;
  active:string = "";
  

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
          this.sistemas = [];
          this.sistema_elegido = "";
          window.sessionStorage["user"] = resp.data.info_usuario.id;
          window.sessionStorage["nombre"] = resp.data.info_usuario.nombre;
          window.sessionStorage["foto_user"] = resp.data.info_usuario.url_foto;

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
            this.redirigirPrincipal();
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
    this.redirigirPrincipal();
    this.closeModal();
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
  redirigirPrincipal(){
    if(this.sistema_elegido == "1"){
      this.empresa.obtenerEmpresaPorIdUsuario(window.sessionStorage["user"])
      .subscribe( (object : any) => {
        if(object.ok){
          window.sessionStorage["foto_user"] = "";
          this.router.navigate(["sistema_admin/dashboard"]);
        }else{
          Swal.fire("Ha ocurrido un error","Este usuario no cuenta empresas para administrar","error");
        }
      });
    }
    if(this.sistema_elegido == "2"){
      //Validamos si tiene clientes antes de mandarlo
      this.cliente_service.obtenerClientePorIdUsuario(window.sessionStorage["user"])
      .subscribe( (object : any) => {
        if(object.ok){
          this.router.navigate(["sistema_reclutamiento/dashboard"]);
        }else{
          Swal.fire("Ha ocurrido un error","Este usuario no cuenta con clientes","error");
        }
      });
    }
    if(this.sistema_elegido == "3"){
      this.router.navigate(["sistema_nomina/dashboard"]);
    }
    if(this.sistema_elegido == "4"){
      this.router.navigate(["sistema_control/dashboard"]);
    }
    if(this.sistema_elegido == "5"){
      this.router.navigate(["sistema_super_admin/dashboard"]);
    }
  }
}
