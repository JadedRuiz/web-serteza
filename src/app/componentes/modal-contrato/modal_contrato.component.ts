import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoService } from 'src/app/services/Contrato/Contrato.service';
import { SERVER_API } from 'src/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-contrato',
  templateUrl: './modal_contrato.component.html',
  styleUrls: ['./modal_contrato.component.css']
})
export class ModalContratoComponent implements OnInit {

  @Input() id_empresa : string;
  @Input() id_movimiento : string;
  contratos : any;
  add_contrato = false;
  @ViewChild("content",{static: false}) modal : any;
  @ViewChild("contentPalabra",{static: false}) modal_palabras : any;
  modal_control : any;
  json = {
    id_empresa : "0",
    nombre : "",
    documento : ""
  };

  constructor(
    private modalService: NgbModal,
    private contratoService : ContratoService
  ) {
    this.id_empresa = "0";
    this.id_movimiento = "0";
  }

  ngOnInit(): void {
  }

  recuperarContratos(){
    this.contratos = [];
    this.contratoService.recuperarContratos(this.id_empresa)
    .subscribe((object : any) => {
      if(object.ok){
        this.contratos = object.data;
      }
    });
  }

  open(tipo : any) {
    if(tipo == 1){
      this.recuperarContratos();
      this.modal_control = this.modalService.open(this.modal, {ariaLabelledBy: 'modal-basic-title', size : 'md', centered : true, keyboard : false, backdrop : false, animation : true})
    }
    if(tipo == 2){
      this.modalService.open(this.modal_palabras, {ariaLabelledBy: 'modal-basic-title', size : 'lg', centered : true, keyboard : false})
    }
  }

  addContrato(){
    this.add_contrato =  true;
  }

  cerrarAdd(){
    if(this.add_contrato){
      this.add_contrato = false;
    }else{
      this.modal_control.close();
    }
  }

  altaContrato(){
    this.json.id_empresa = this.id_empresa;
    this.confirmar("Confirmación","¿Estás seguro que deseas guardar este contrato?","info",1,this.json);
  }

  descargarReporte(id_contrato : number){
    location.href = SERVER_API+"contratacion/obtenerDocContratacion/"+this.id_movimiento+"/"+id_contrato;
  }

  abrirExplorador(){
    document.getElementById("explorador")?.click();
  }

  subirDoc(event: any){
    if (event.target.files && event.target.files[0]) {
      let archivos = event.target.files[0];
      let extension = archivos.name.split(".")[1];
      if(extension == "docx" || extension == "DOCX"){
        this.convertirImagenAB64(archivos).then( respuesta => {
          this.json.documento = respuesta+"";
        });
      }else{
        Swal.fire("Ha ocurrido un error","Tipo de documento no permitido","info");
      }
    }
  }

  convertirImagenAB64(fileInput : any){
    return new Promise(function(resolve, reject) {
      let b64 = "";
      const reader = new FileReader();
      reader.readAsDataURL(fileInput);
      reader.onload = (e: any) => {
          b64 = e.target.result.split("base64,")[1];
          resolve(b64);
      };
    });
  }

  confirmar(title : any ,texto : any ,tipo_alert : any,tipo : number,json : any){
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
        if(tipo == 1){  //Alta contrato
          this.contratoService.altaContrato(json)
          .subscribe((object : any) => {
              if(object.ok){
                this.recuperarContratos();
                this.cerrarAdd();
                Swal.fire("Buen trabajo","Se han dado de alta los movimientos","success");
              }else{
                Swal.fire("Aviso",object.message,"info");
              }
          })
        }
      }
    });
  }
}
