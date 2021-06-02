import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public url_foto = window.sessionStorage.getItem("foto_user");
  public usuario_logueado = window.sessionStorage.getItem("user");
  public empresa_seleccionado = parseInt(window.sessionStorage["empresa"]);
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public band = false;
  public texto : String;
  public modal: any;
  public empresas : any;
  keyword = 'nombre';
  data = new Array;
  constructor(private router: Router,
    public empresa_service : EmpresaService,
    private modalService: NgbModal
    ) {
      this.texto = "SISTEMA ADMINISTRATIVO";
     }

  ngOnInit(): void {
    this.recuperarEmpresas();
  }
  recuperarEmpresas(){
    this.empresas = [];
    this.empresa_service.obtenerEmpresaPorIdUsuario(this.usuario_logueado)
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(this.empresa_seleccionado);
        if(object.data.length > 1){
          for(let i=0;i<object.data.length;i++){
            if(this.empresa_seleccionado == parseInt(object.data[i].id_empresa)){
              this.empresas.push({
                "empresa" : object.data[i].empresa,
                "id_empresa" : object.data[i].id_empresa,
                "class" : "active"
              });
            }else{
              this.empresas.push({
                "empresa" : object.data[i].empresa,
                "id_empresa" : object.data[i].id_empresa,
                "class" : ""
              });
            }
          }
        }
      }
    });
  }
  eleccion(id_empresa : any){
    window.sessionStorage["empresa"] = id_empresa;
    location.reload();
    this.closeModal();
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
    this.empresa_seleccionado = parseInt(window.sessionStorage["empresa"]);
    this.recuperarEmpresas();
  }
  closeModal(){
    this.modal.close();
  }
}
