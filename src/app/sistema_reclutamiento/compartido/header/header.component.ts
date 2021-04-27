import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';
import { Router } from '@angular/router';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { ClienteService } from 'src/app/services/Cliente/cliente.service';

@Component({
  selector: 'app-header-rc',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public color = COLOR;
  public nombre = window.sessionStorage.getItem("nombre");
  public url_foto = window.sessionStorage.getItem("foto_user");
  public band = false;
  public texto = "";
  keyword = 'nombre';
  data = new Array;
  constructor(private router: Router,
    public candidato: CandidatoService,
    public empresa : EmpresaService,
    public cliente : ClienteService
    ) {
      
     }

  ngOnInit(): void {
  }
  autocomplete(){
    if(this.router.url.toString().includes("catalogo_empresa")){
      let id = parseInt(window.sessionStorage.getItem("sistema")+"");
      let arreglo = new Array();
      this.empresa.obtenerEmpresas(id)
      .subscribe( (object : any) => {
        if(object.ok){
          for(let i=0;i<object.data.length;i++){
            arreglo.push({
              "nombre" : object.data[i].empresa,
              "id" : object.data[i].id
            });
          }
          this.data = arreglo;
        }else{
          this.data = [];
        }
      });
      // this.getEmpleadoService();
    }
    if(this.router.url.toString().includes("catalogo_candidato")){
      let arreglo = new Array();
      let id = parseInt(window.sessionStorage.getItem("cliente")+"");
      this.candidato.obtenerCandidatosPorIdCliente(id)
      .subscribe( (object : any) => {
        if(object.ok){
          for(let i=0;i<object.data.length;i++){
            arreglo.push({
              "nombre" : object.data[i].nombre,
              "id" : object.data[i].id
            });
          }
          this.data = arreglo;
        }else{
          this.data = [];
        }
      });
    }
    if(this.router.url.toString().includes("catalogo_cliente")){
      let arreglo = new Array();
      let id = parseInt(window.sessionStorage.getItem("sistema")+"");
      this.cliente.obtenerClientes(id)
      .subscribe( (object : any) => {
        if(object.ok){
          for(let i=0;i<object.data.length;i++){
            arreglo.push({
              "nombre" : object.data[i].cliente,
              "id" : object.data[i].id
            });
          }
          this.data = arreglo;
        }else{
          this.data = [];
        }
      });
      this.data = [];
    }
  }
  selectEvent(event : any){
    if(this.router.url.toString().includes("catalogo_candidato")){
      this.data = [];
      this.router.navigateByUrl("/catalogo_candidato/"+event.id);
    }
    if(this.router.url.toString().includes("catalogo_empresa")){
      this.data = [];
      this.router.navigateByUrl("/catalogo_empresa/"+event.id);
    }
    if(this.router.url.toString().includes("catalogo_cliente")){
      this.data = [];
      this.router.navigateByUrl("/catalogo_cliente/"+event.id);
    }
  }
}
