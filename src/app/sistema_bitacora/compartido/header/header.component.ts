import { Component, OnInit, ViewChild } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';
import Swal from 'sweetalert2';
import { PeriodoService } from 'src/app/services/Periodo/Periodo.service';

@Component({
  selector: 'app-header-rc',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public usuario_logueado = window.sessionStorage.getItem("user");
  public id_nomina = window.sessionStorage.getItem("tipo_nomina");
  public url_foto : any;
  public empresa_seleccionado = parseInt(window.sessionStorage["empresa"]);
  public header = ["","","",""];
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public modal: any;
  public empresas : any;
  public nominas : any;
  public texto : String;
  public nombre_empresa : String;
  public tipo_arreglo = 0;
  public periodo = "";

  constructor(private router: Router,
    public empresa_service : EmpresaService,
    private modalService: NgbModal,
    public nomina_service : NominaService,
    public periodo_service : PeriodoService
    ) {
      this.texto = "SISTEMA DE RECLUTAMIENTO";
      this.url_foto = './assets/iconos/perfil.svg';
      this.nombre_empresa = "";
     }

  ngOnInit(): void {
    this.recuperarEmpresas();
    this.mostrarHeaderDash();
    this.url_foto = window.sessionStorage["foto"];
  }
  mostrarHeaderDash(){
    this.nomina_service.obtenerNombreNominaPorId(this.id_nomina)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.header[1] = object.data[0].nomina;
      }else{
        this.header[1] = "Sin tipo, seleccionado"
      }
    });
    this.periodo_service.obtenerPeriodoEjercicioActual(this.empresa_seleccionado,this.id_nomina)
    .subscribe((object : any) => {
      if(object.ok){
        this.periodo = object.data.fecha_inicial+"/"+object.data.fecha_final;
      }else{
        this.periodo = "Periodo no disponible"
      }
    })
  }
  recuperarEmpresas(){
    this.empresas = [];
    this.empresa_service.obtenerEmpresaPorIdUsuario(this.usuario_logueado)
    .subscribe( (object : any) => {
      if(object.ok){
        if(object.data.length > 1){
          this.tipo_arreglo = 0;
          for(let i=0;i<object.data.length;i++){
            if(this.empresa_seleccionado == parseInt(object.data[i].id_empresa)){
              this.empresas.push({
                "empresa" : object.data[i].empresa,
                "id_empresa" : object.data[i].id_empresa,
                "class" : "active"
              });
              this.nombre_empresa = object.data[i].empresa;
            }else{
              this.empresas.push({
                "empresa" : object.data[i].empresa,
                "id_empresa" : object.data[i].id_empresa,
                "class" : ""
              });
            }
          }
        }else{
          window.sessionStorage["empresa"] = object.data[0].id_empresa;
        }
      }
    });
  }
  eleccion(id_cliente : any){
    window.sessionStorage["empresa"] = id_cliente;
    this.closeModal();
    let json = {
      id_empresa : id_cliente,
      id_status : 1
    };
    this.nomina_service.obtenerLigaEmpresaNomina(json)
    .subscribe( (object : any) => {
      if(object.ok){
        if(object.data.length > 1){
          this.tipo_arreglo = 1;
          this.nominas = object.data;
          this.openModal();
        }else{
          window.sessionStorage["tipo_nomina"] = object.data[0].id_nomina;
          this.router.navigate(["sistema_nomina/dashboard"]); 
        }
      }else{
        Swal.fire("Ha ocurrido un error","Este empresa no tipos de nómina","error");
      }
    });
  }
  redireccionNomina(id_nomina : any){
    window.sessionStorage["tipo_nomina"] = id_nomina;
    this.closeModal();
    location.reload();
  }
  openModal() {
    this.modal = this.modalService.open(this.contenidoDelModal,{ centered : true, backdropClass : 'light-blue-backdrop'});
  }
  closeModal(){
    this.modal.close();
  }
}
