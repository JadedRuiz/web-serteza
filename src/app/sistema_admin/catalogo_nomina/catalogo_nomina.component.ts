import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';
import { COLOR } from 'src/config/config';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NominaService } from 'src/app/services/Nomina/Nomina.service';

@Component({
  selector: 'app-catalogo-nomina',
  templateUrl: './catalogo_nomina.component.html',
  styleUrls: ['./catalogo_nomina.component.css']
})
export class CatalogoNominaComponent implements OnInit {

  public status  = -1;
  public color = COLOR;
  public taken = 5;
  public modal : any;
  @ViewChild('content', {static: false}) contenidoDelModal : any;
  public usuario = parseInt(window.sessionStorage.getItem("user")+"");
  public empresa = parseInt(window.sessionStorage.getItem("empresa")+"");
  public catalogo_nomina : any;
  public tipo_nomina = 0;
  public nominas : any;

  constructor(
    private modalService: NgbModal,
    private compartido_service : CompartidoService,
    private nomina_service : NominaService
    ) { }

  ngOnInit(): void {
    this.mostrarNominas();
  }

  mostrarNominas(){
    this.nominas = [];
    let json = {
      id_empresa : this.empresa,
      id_status : this.status
    };
    this.nomina_service.obtenerLigaEmpresaNomina(json)
    .subscribe( (object : any)=>{
      if(object.ok){
        this.nominas = object.data;
      }
    });
  }

  mostrarCatalogoNomina(){
    this.catalogo_nomina = [];
    this.compartido_service.obtenerCatalogo("nom_cat_nomina")
    .subscribe( (object : any) => {
      if(object.length > 0){
        this.catalogo_nomina = object;
      }
    });
  }

  altaNomina(){
    if(this.tipo_nomina == 0){
      Swal.fire("Información","No se puede agregar sin antes seleccionar un tipo","info");
    }else{
      this.confirmar("Confirmación","¿Seguro que deseas agregarlo?","info",1,null);
    }
  }
  eliminarLiga(id : any){
    this.confirmar("Confirmación","¿Seguro que deseas eliminar el tipo de nómina?","info",2,id);
  }
  activarLiga(id : any){
    this.confirmar("Confirmación","¿Seguro que deseas activar el tipo de nómina?","info",3,id);
  }
  openModal() {
    this.mostrarCatalogoNomina();
    this.tipo_nomina = 0;
    this.modal = this.modalService.open(this.contenidoDelModal,{ size: 'md', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  cerrarModal(){
    this.modal.close();
  }
  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number, data : any){
    Swal.fire({
      title: title,
      text: texto,
      icon: tipo_alert,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText : "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        if(tipo == 1){  //Guardar
          let json = {
            id_nomina : this.tipo_nomina,
            id_empresa : this.empresa,
            usuario_creacion : this.usuario
          };
          this.nomina_service.insertarLigaNominaEmpresa(json)
          .subscribe( (object : any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha agregado el tipo de nomina a la empresa","success");
              this.cerrarModal();
              this.mostrarNominas();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 2){  //Eliminar
          this.nomina_service.eliminarLigaEmpresaNomina(data)
          .subscribe( (object : any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha eliminado el tipo de nomina a la empresa","success");
              this.mostrarNominas();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
        if(tipo == 3){  //Activar
          this.nomina_service.activarLigaEmpresaNomina(data)
          .subscribe( (object : any)=>{
            if(object.ok){
              Swal.fire("Buen trabajo","Se ha activado el tipo de nomina a la empresa","success");
              this.mostrarNominas();
            }else{
              Swal.fire("Ha ocurrido un error",object.message,"error");
            }
          });
        }
      }
    });
  }
}
