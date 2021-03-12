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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public color = COLOR;
  usuario: Usuario = new Usuario("","");
  sistemas : any;
  empresas : any;
  clientes : any;
  sistema_elegido = "";
  empresa_elegido = "";
  cliente_elegido = "";
  disabled_empresa = true;
  disabled_cliente = true;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  modal: any;
  

  constructor( 
    public usuario_service : UsuarioService,
    private router : Router,
    private modalService: NgbModal,
    private cliente: ClienteService
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
          this.empresas = [];
          this.clientes = [];
          this.cliente_elegido = "";
          this.sistema_elegido = "";
          this.empresa_elegido = "";

          window.sessionStorage["foto_user"] = resp.data.info_usuario.url_foto;
          window.sessionStorage["user"] = resp.data.info_usuario.usuraio;
          window.sessionStorage["nombre"] = resp.data.info_usuario.nombre;
          this.usuario_service.guardarToken(resp.data.token_acesso.token);

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
            //Guardo variables de sesion
            this.sistemas = [{
              "sistema" : resp.data.info_usuario.sistemas[0].sistema,
              "id" : resp.data.info_usuario.sistemas[0].id
            }];
            this.sistema_elegido = resp.data.info_usuario.sistemas[0].id;
            window.sessionStorage["sistema"] = resp.data.info_usuario.sistemas[0].id;
            this.usuario_service.obtenerEmpresas(resp.data.info_usuario.sistemas[0].id)
            .subscribe( (objeto : any) => {
              if(objeto.data.length > 1){   //Tiene más de una empresa
                for(let i=0; i<objeto.data.length; i++){
                  this.empresas.push({
                    "empresa" : objeto.data[i].empresa,
                    "id" : objeto.data[i].id
                  })
                }
                this.openModal();
                this.disabled_empresa = false;
              }else{                        //tiene solo una empresa 
                this.empresas = [{
                  "empresa" : objeto.data[0].empresa,
                  "id" : objeto.data[0].id
                }];
                this.empresa_elegido = resp.data.info_usuario.sistemas[0].id;
                window.sessionStorage["empresa"] = objeto.data[0].id;
                this.cliente.obtenerClientes(parseInt(objeto.data[0].id))
                .subscribe( (respuesta: any) => {
                  console.log(respuesta);
                  if(respuesta.data.length > 1){    //Tiene muchos clientes
                    for(let i=0; i<respuesta.data.length; i++){
                      this.clientes.push({
                        "cliente" : respuesta.data[i].cliente,
                        "id" : respuesta.data[i].id
                      });
                    }
                    this.openModal();
                    this.disabled_cliente = false;
                  }else{                    //Solo un cliente
                    window.sessionStorage["cliente"] = respuesta.data[0].id;
                    Swal.fire("Buen trabajo","Te has logueado con éxito","success");
                    this.router.navigateByUrl("dashboard");
                    console.log(this.sistema_elegido+"/"+this.empresa_elegido+"/"+this.cliente_elegido);
                  }
                });
              }
            });;
            //Reenvio a la vista del admin
            // this.router.navigate(["dashboard"]);
          }
          
        }else{
          Swal.fire("Ha ocurrio un error",resp.data,"error");
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
  mostrarEmpresas() {
    this.empresas = [];
    this.clientes = [];
    this.disabled_cliente = true;
    this.disabled_empresa = true;
    this.usuario_service.obtenerEmpresas(parseInt(this.sistema_elegido.valueOf()))
    .subscribe( (objeto : any) => {
      if(objeto.ok){
        for(let i=0; i<objeto.data.length; i++){
          let json = {
            "empresa" : objeto.data[i].empresa,
            "id" : objeto.data[i].id
          }
          this.empresas.push(json); 
        }
        
        this.disabled_empresa = false;
      }else{
        Swal.fire("Ha ocurrido un error",objeto.data,"error");
      }
    });;
  }
  mostrarClientes() {
    this.clientes = [
      "Seleccionar cliente"
    ];
    this.disabled_cliente = true;
    this.cliente.obtenerClientes(parseInt(this.empresa_elegido.valueOf()))
    .subscribe( (objeto : any) => {
      if(objeto.ok){
        for(let i=0; i<objeto.data.length; i++){
          let json = {
            "cliente" : objeto.data[i].cliente,
            "id" : objeto.data[i].id
          }
          this.clientes.push(json); 
        }
        
        this.disabled_cliente = false;
      }else{
        Swal.fire("Ha ocurrido un error",objeto.data,"error");
      }
    });;
  }
  entrar() {
    console.log(this.sistema_elegido+"/"+this.empresa_elegido+"/"+this.cliente_elegido);
    if(this.sistema_elegido != "" && this.empresa_elegido != "" && this.cliente_elegido != ""){
      window.sessionStorage["sistema"] = this.sistema_elegido;
      window.sessionStorage["empresa"] = this.empresa_elegido;
      window.sessionStorage["cliente"] = this.cliente_elegido;
      this.closeModal();
      this.router.navigate(["dashboard"]);
    }else{
      Swal.fire("Advertencia","Primero seleccione el sistema, empresa y cliente que desea administrar","warning");
    }
  }
}
