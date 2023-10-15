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

@Component({
  selector: 'app-proced-bitacora',
  templateUrl: './proced-bitacora.component.html',
  styleUrls: ['./proced-bitacora.component.css'],
})
export class ProcedBitacoraComponent implements OnInit {
  public color = COLOR;
  public direccion : Direccion = new Direccion(0,"","","","","","","","","","","");
  public fotografia = new Fotografia(0,"","","");
  public id_cliente = parseInt(window.sessionStorage.getItem("cliente")+"");
  public candidato = new Candidato(0,this.id_cliente,6,"","","","","","","","",0,"","","","","",0,this.direccion,this.fotografia);
  public candidatos : any;


  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  filterControlEmpleados = new FormControl();
  objEmpleados: any;
  // VARIABLES TABLA
  displayedColumns: string[] = [
    'fecha',
    'entrada',
    'salida',
    'tipoF',
    'tipoD',
    'tipoV',
    'tipoR',
    'descripcion',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('content', { static: false }) modal_mov: any;

  showModal = false;
  selectedRowData: any;
  modal: any;
  public status = -1; //Status default
  public palabra = "";
  filterControl = new FormControl();
  candidatos_busqueda : any;


  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,

    ) {
    // Genera datos de prueba
    this.objEmpleados = '';
    this.dataSource.data = this.generateTableData();
  }

  ngOnInit(): void {}

  buscarEmpleado() {}


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
         this.dataSource.data = object.data;
        // n this.dataSource.paginator = this.paginator;
      }
    })
  }
}











  private generateTestData(): any[] {
    const testData = [];
    for (let i = 1; i <= 10; i++) {
      testData.push({
        id_empleado: i,
        nombre: `Empleado ${i}`,
      });
    }
    return testData;
  }

  private generateTableData(): any[] {
    const tableData = [];
    for (let i = 1; i <= 15; i++) {
      tableData.push({
        fecha: `2023-10-${i}`,
        entrada: `Entrada ${i}`,
        salida: `Salida ${i}`,
        tipoF: 'A',
        tipoD: 'M',
        tipoV: 'B',
        tipoR: 'A',
        descripcion: `Descripción ${i}`,
      });
    }
    return tableData;
  }

  // MODAL
  openModal(rowData: any) {
    this.modal = this.modalService.open(this.modal_mov, {
      size: 'md',
      centered: true,
    });
    this.selectedRowData = rowData;
  }

  closeModal() {
    this.modal.close();
  }
}
