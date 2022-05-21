import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/Usuario/usuario.service';

@Component({
  selector: 'app-header-rc',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  sistema_seleccionado = parseInt(window.sessionStorage.getItem("sistema")+"");
  public usuario_logueado = window.sessionStorage.getItem("user");
  public url_foto : any;
  public cliente_seleccionado = parseInt(window.sessionStorage["cliente"]);
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;
  public clientes : any;
  public empresas : any;
  empresas_copy : any;
  public sistemas : any;
  public texto : String;
  public nombre_cliente : String;
  sistema_elegido = "";
  tipo_modal = 0;
  constructor(private router: Router,
    public cliente_service : ClienteService,
    public usuario_service : UsuarioService,
    private modalService: NgbModal
    ) {
      this.texto = "SISTEMA DE RECLUTAMIENTO";
      this.url_foto = './assets/iconos/perfil.svg';
      this.nombre_cliente = "";
     }

  ngOnInit(): void {
    this.recuperarClientes();
    this.recuperarSistemas();
    this.url_foto = window.sessionStorage["foto"];
  }

  recuperarSistemas(){
    this.sistemas = [];
    this.usuario_service.obtenerSistemasPorIdUsuario(this.usuario_logueado)
    .subscribe((object : any) => {
      for(let i=0;i<object.data.length;i++){
        if(this.sistema_seleccionado == parseInt(object.data[i].id_sistema)){
          this.sistemas.push({
            "sistema" : object.data[i].sistema,
            "id_sistema" : object.data[i].id_sistema,
            "id_perfil" : object.data[i].id_perfil,
            "class" : "active"
          });
        }else{
          this.sistemas.push({
            "sistema" : object.data[i].sistema,
            "id_sistema" : object.data[i].id_sistema,
            "id_perfil" : object.data[i].id_perfil,
            "class" : ""
          });
        }
      }
    });
  }

  recuperarClientes(){
    this.clientes = [];
    this.cliente_service.obtenerClientePorIdUsuario(this.usuario_logueado)
      .subscribe( (object : any) => {
        if(object.ok){
          if(object.data.length > 1){
            for(let i=0;i<object.data.length;i++){
              if(this.cliente_seleccionado == parseInt(object.data[i].id_cliente)){
                this.nombre_cliente = object.data[i].cliente;
                this.clientes.push({
                  "cliente" : object.data[i].cliente,
                  "id_cliente" : object.data[i].id_cliente,
                  "class" : "active"
                });
              }else{
                this.clientes.push({
                  "cliente" : object.data[i].cliente,
                  "id_cliente" : object.data[i].id_cliente,
                  "class" : ""
                });
              }
            }
          }
        }
      });
  }

  eleccion(id_cliente : any){
    window.sessionStorage["cliente"] = id_cliente;
    location.reload();
    this.closeModal();
  }


  openModal(tipo : any) {
    this.tipo_modal = tipo;
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
