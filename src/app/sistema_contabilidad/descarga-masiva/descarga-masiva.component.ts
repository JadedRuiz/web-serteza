import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DescargaMasivaService } from 'src/app/services/contabilidad/descarga-masiva.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-descarga-masiva',
  templateUrl: './descarga-masiva.component.html',
  styleUrls: ['./descarga-masiva.component.css']
})
export class DescargaMasivaComponent implements OnInit {
  recibidos = false;
  emitidos = false;
  obj: any = [];
  miEmpresa = window.sessionStorage["empresa"];
  miUsuario = parseInt(window.sessionStorage.getItem("user")+"");
  fecha_inicial = "";
  fecha_final = "";
  rfc = "";
  id_estatus = 0;
  miObjeto: any = {
    id_empresa: "",
    fecha_inicial: this.miEmpresa,
    fecha_final: false,
    rfc: "",
    recibidos: true,
    emitidos: true,
    id_usuario: this.miUsuario
  };
  constructor(private descargaMasivaService: DescargaMasivaService) { }

  ngOnInit(): void {
    this.getSolicitudes();
  }
  limpiar(){
    return true;
  }
  getSolicitudes(){
    this.descargaMasivaService.getSolicitudes(3, this.id_estatus)
    .subscribe( (object : any) => {
      if(object.ok){
        console.log(object);
        this.obj = object.data;
      }else{
        Swal.fire("Ha ocurrido un error",object.message,"error");
      }
    });
  }
  getSolicitudesEstatus(){
    console.log(this.id_estatus);
    this.getSolicitudes();
  }
  cambioFechas(evt: any){
    var target = evt.target.value;
    //this.objFactura = [];
    if(target == "recibidos"){
      this.recibidos = true;
      this.emitidos = false;
    }else if(target == "emitidos"){
      this.recibidos = false;
      this.emitidos = true;
    }
  }
  actualizar(obj: any){
    this.cargaEspera();
      this.miObjeto = {
        id_empresa: this.miEmpresa,
        id_solicitud_sat: obj.id_solicitud_sat,
        clave_solicitud_sat: obj.clave_solicitud,
        id_usuario: this.miUsuario
      };
      console.log(this.miObjeto)
      this.descargaMasivaService.actualizarSolicitud(this.miObjeto)
      .subscribe( objeto => {
        this.getSolicitudes();
      });
    console.log(obj);
  }
  cargar(obj: any){
  this.cargaEspera();
      this.miObjeto = {
        id_empresa: this.miEmpresa,
        id_solicitud: obj.id_solicitud_sat,
        nombre_archivo_sat: obj.nombre_archivo_sat,
        id_usuario: this.miUsuario
      };
      console.log(this.miObjeto)
      this.descargaMasivaService.cargarSolicitud(this.miObjeto)
      .subscribe( objeto => {
        this.getSolicitudes();
      });
    console.log(obj);
  }
  getDetalle(obj: any){
    console.log(obj);

  }
  cancelar(obj: any){    
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Seguro de cancelar solicitud?',
      text: "Esta acción no se revertirá",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Cancelarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaEspera();
        this.miObjeto = {
          id_solicitud: obj.id_solicitud_sat,
          id_usuario: this.miUsuario
        };
        console.log(this.miObjeto)
        this.descargaMasivaService.cancelarSolicitud(this.miObjeto)
        .subscribe( objeto => {
          this.getSolicitudes();
        });
      console.log(obj);
        // swalWithBootstrapButtons.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        
      }
    })
    
  }
  guardarCatalogo(f: NgForm) {
    console.log("entro");
    if ( f.invalid ) {
      return;
    }
    this.cargaEspera();
    console.log(f);
      this.miObjeto = {
        id_empresa: this.miEmpresa,
        fecha_inicio: this.fecha_inicial,
        fecha_final: this.fecha_final,
        rfc: this.rfc,
        recibidos: this.recibidos,
        emitidos: this.emitidos,
        id_usuario: this.miUsuario
      };
      console.log(this.miObjeto)
      this.descargaMasivaService.crearSolicitudes(this.miObjeto)
      .subscribe( objeto => {
        this.getSolicitudes();
      });
  }
  cargaEspera(){
    let timerInterval = 0
    Swal.fire({
      title: 'Espere por favor...',
      html: '',
      timer: 90000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {

    })
  }
}
