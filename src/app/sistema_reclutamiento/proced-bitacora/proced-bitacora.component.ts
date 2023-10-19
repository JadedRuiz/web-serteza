import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { COLOR, SERVER_API } from 'src/config/config';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncidenciaService } from 'src/app/services/incidencias/incidencia.service';
import { JustificacionService } from 'src/app/services/justificaciones/justificacion.service';
import { Justificacion } from 'src/app/models/Justificaciones';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-proced-bitacora',
  templateUrl: './proced-bitacora.component.html',
  styleUrls: ['./proced-bitacora.component.css'],
})
export class ProcedBitacoraComponent implements OnInit {
  public color = COLOR;
  public justificacion : Justificacion = new Justificacion(0,0,0,'','');
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",0,this.direccion,this.fotografia);
  public candidatos : any;
  showModal = false;
  selectedRowData: any;
  modal: any;
  public status = -1; //Status default
  public palabra = "";
  justi : any = "";
  filterControl = new FormControl();
  candidatos_busqueda : any;

  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  filterControlEmpleados = new FormControl();
  objEmpleados: any;
  empleadosIns : any = ''
consulta = false;
  // VARIABLES TABLA
  displayedColumns: string[] = [
    'fecha',
    'dia_descrip',
    'hr_entrada',
    'hr_salida',
    'falta',
    'dia_festivo',
    'vacaciones',
    'retardos',
    'observaciones',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('content', { static: false }) modal_mov: any;
  id_empleado :any= ''
  fotoEmpleado:any = ''
  nombreEmpleado:any = ''
  fechaEmpleado:any = ''
  diaEmpleado:any = ''


  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
    private incidencia_service: IncidenciaService,
    private just_service: JustificacionService

    ) {
    // Genera datos de prueba
    this.objEmpleados = '';
    // this.dataSource.data ='';
  }

  ngOnInit(): void {}

  buscarEmpleado() {}


// MODAL
 openModal(rowData: any) {
   this.selectedRowData = rowData;
   this.consultarjusticaciones()

   this.modal = this.modalService.open(this.modal_mov, {
     size: 'md',
    centered: true,
  });
  // console.log(this.selectedRowData);
}

closeModal() {
  this.modal.close();
}



// BARRA DE BUSQUEDA
mostrarCandidatos(){
  let json = {
    palabra : this.palabra.toUpperCase(),
    status : this.status,
    id_cliente : this.id_cliente,
    tipo : 1
  };
  this.candidatos = [];
  this.candidato_service.obtenerCandidatos(json)
  .subscribe( (object : any) =>{
      if(object.ok){
        // this.dataSource.data = object.data;
        // this.dataSource.paginator = this.paginator;
       this.candidatos_busqueda= object.data;
       this.objEmpleados = object.data
      }
  });
}
buscarCandidato(){
  this.palabra = this.filterControl.value;
  if(this.filterControl.value.length < 1){
    this.mostrarCandidatos();
  }
  if(this.filterControl.value.length > 2){
    this.autocomplete(this.filterControl.value);
  }
}
autocomplete(palabra : string){
 // this.candidatos_busqueda = [];
  if(palabra.length > 2){
    let json = {
      nombre_candidato : this.palabra.toUpperCase(),
      status : this.status,
      id_cliente : this.id_cliente
    };
    this.candidato_service.autoCompleteCandidato(json)
    .subscribe((object : any) => {
      if(object.ok){
        this.objEmpleados = object.data;
        this.id_empleado = this.objEmpleados[0].id_candidato
        // console.log('objEmpleados', this.id_empleado);
      }
    })
  }
  this.consultarIncidencias();
}


// INCIDENCIAS
// Consultar

consultarIncidencias(){
  this.justi= [];
  this.diaEmpleado = '';
this.consulta = true;
  let json = {
      id_incidencias: 0,
      id_cliente: 5,
      id_candidato: this.id_empleado,
      id_empresa: 0,
      id_sucursal: 0,
      id_departamento: 0,
      id_puesto: 0,
      solo_incidencias: 0,
      fecha_incial: "",
      fecha_final: "",
      token: "012354SDSDS01"
  }
  this.incidencia_service.obternerIncidencias(json).subscribe((resp)=>{
    if (resp.ok){
      this.dataSource.data = resp.data;
      this.empleadosIns = resp.data;
      this.fotoEmpleado= this.empleadosIns[0].fotografia;
      this.nombreEmpleado= this.empleadosIns[0].nombre_completo;
      // this.fechaEmpleado= this.empleadosIns[0].fecha;
      this.diaEmpleado= this.empleadosIns[0].dia_descrip;

      // console.log('incidencia.data :>> ', this.empleadosIns );
    }
  })
}


// => JUSTIFICACIONES <=
// Consultar
consultarjusticaciones(){
  this.justi = ''

  let json = {
    id_justificacion: 0,
    id_cliente: 5,
    id_candidato: this.selectedRowData.id_candidato,
    id_empresa: 0,
    id_sucursal: 0,
    id_departamento: 0,
    id_puesto: 0,
    sin_autorizar: 1,
    fecha_incial: this.selectedRowData.fecha,
    fecha_final: this.selectedRowData.fecha,
    token: "012354SDSDS01"
  }
  console.log('=><', json)
  this.just_service.obternerJustificaciones(json).subscribe((resp)=>{
    if (resp.ok){

      this.justi = resp.data
      console.log('JUSTI :>> ', this.justi);
    }
  })

}

guardarJustificacion(){
  let json = {
    id_justificacion: 0,
    id_cliente: 5,
    id_candidato: this.justi[0].id_candidato,
    motivo: this.justi[0].motivo,
    fecha: this.justi[0].fecha
  }
  console.log('Guardar justi=>',json);
  // this.just_service.guardarJustificacion(json).subscribe((resp)=>{
  //   if (resp.ok){
  //     Swal.fire(
  //       'Exito',
  //       'Justificacion actulizada',
  //       'success'
  //     )
  //   }
  // })
  Swal.fire(
    'Exito',
    'Justificacion actulizada',
    'success'
  )

  this.closeModal();

}


}
// PARA DATOS FIGTICIOS
  // private generateTestData(): any[] {
  //   const testData = [];
  //   for (let i = 1; i <= 10; i++) {
  //     testData.push({
  //       id_empleado: i,
  //       nombre: `Empleado ${i}`,
  //     });
  //   }
  //   return testData;
  // }

  // private generateTableData(): any[] {
  //   const tableData = [];
  //   for (let i = 1; i <= 15; i++) {
  //     tableData.push({
  //       fecha: `2023-10-${i}`,
  //       entrada: `Entrada ${i}`,
  //       salida: `Salida ${i}`,
  //       tipoF: 'A',
  //       tipoD: 'M',
  //       tipoV: 'B',
  //       tipoR: 'A',
  //       descripcion: `Descripción ${i}`,
  //     });
  //   }
  //   return tableData;
  // }
