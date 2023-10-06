import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { COLOR } from 'src/config/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-proced-bitacora',
  templateUrl: './proced-bitacora.component.html',
  styleUrls: ['./proced-bitacora.component.css'],
})
export class ProcedBitacoraComponent implements OnInit {
  public color = COLOR;
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

  constructor(private modalService: NgbModal) {
    // Genera datos de prueba
    this.objEmpleados = this.generateTestData();
    this.dataSource.data = this.generateTableData();
  }

  ngOnInit(): void {}

  buscarEmpleado() {}

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
