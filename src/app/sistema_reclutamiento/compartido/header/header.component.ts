import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header-rc',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public usuario_logueado = window.sessionStorage.getItem("user");
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;
  public clientes : any;

  constructor(private router: Router,
    public cliente_service : ClienteService,
    private modalService: NgbModal
    ) {
      
     }

  ngOnInit(): void {
    this.recuperarClientes();
  }
  recuperarClientes(){
    this.clientes = [];
    this.cliente_service.obtenerClientePorIdUsuario(this.usuario_logueado)
      .subscribe( (object : any) => {
        console.log(object);
        if(object.ok){
          if(object.data.length > 1){
            this.clientes.push(object.data);
          }
        }
      });
  }
  eleccion(id_cliente : any){
    window.sessionStorage["cliente"] = id_cliente;
    location.reload();
    this.closeModal();
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}