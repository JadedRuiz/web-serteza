import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { COLOR } from 'src/config/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FestivosService } from 'src/app/services/festivos/festivos.service';
import { Festivos } from 'src/app/models/festivos';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-catalogo-festivos',
  templateUrl: './catalogo-festivos.component.html',
  styleUrls: ['./catalogo-festivos.component.css'],
})
export class CatalogoFestivosComponent implements OnInit {
  public color = COLOR;
  public festivo = new Festivos(0, 0, 0, '', '', '', 1, 0, 1);
  public id_perfil = parseInt(window.sessionStorage.getItem('perfil') + '');
  public id_cliente = parseInt(window.sessionStorage.getItem('cliente') + '');
  // VARIABLES TABLA
  displayedColumns: string[] = ['fecha', 'descripcion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('content', { static: false }) modal_mov: any;
  selectedYear: number; // Variable para almacenar el año seleccionado
  availableYears: number[] = [2023, 2024, 2025, 2026]; // Aquí puedes definir los años disponibles
  showModal = false;
  selectedRowData: any;
  modal: any;
  festivos: any;
  modalActivo = false;

  constructor(
    private modalService: NgbModal,
    private festivosService: FestivosService
  ) {
    // Genera año
    this.selectedYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.obtenerfestivos();
  }


  obtenerfestivos() {
    let json = {
      id_dia_festivo: 0,
      id_cliente: this.id_cliente,
      ejercicio: this.selectedYear,
      descripcion: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.festivosService.obternerFestivos(json).subscribe((resp) => {
      this.dataSource.data = resp.data;
    });
  }

  // PARA FOTMATEAR FECHA
  formatFecha() {
    const fechaOriginal = new Date(
      this.festivo.fecha
    );

    const año = fechaOriginal.getFullYear();
    const mes = fechaOriginal.getMonth() + 1;
    const dia = fechaOriginal.getDate();
    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia
      .toString()
      .padStart(2, '0')}`;

    //console.log(fechaFormateada);
    this.festivo.fecha = fechaFormateada
  }

  guadarfestivos() {
    this.formatFecha();
    let json = {
      id_dia_festivo: 0,
      id_cliente: this.id_cliente,
      ejercicio: this.selectedYear,
      descripcion: this.festivo.descripcion,
      fecha: this.festivo.fecha,
      token: '012354SDSDS01',
      activo: 1,
      id_usuario: 1,
    };
    this.festivosService.guardarFestivos(json).subscribe((resp) => {
      if(resp.ok){
        Swal.fire(
          'Fecha guardada',
          '',
          'success'
        )

        this.modalActivo = false; // Cierra el modal
        this.festivo.fecha = ''; // Limpia la fecha
        this.festivo.descripcion = ''; // Limpia la descripción
        this.obtenerfestivos();
      }
    });
    // console.log('guardarFest=>', json);

    document.getElementById('cerrar1')!.click();
  }


  // MODAL
  openEditarModal(rowData: any) {
    this.festivo = rowData;
    this.selectedRowData = rowData; // Asigna los datos de la fila a la variable selectedRowData
    this.modalActivo = true;
    console.log(rowData);
  }

  editarfestivos() {
    if (this.selectedRowData) {
      this.formatFecha();

      // Asigna el ID del festivo desde los datos seleccionados
      this.festivo.id_dia_festivo = this.selectedRowData.id_dia_festivo;

      let json = {
        id_dia_festivo: this.festivo.id_dia_festivo,
        id_cliente: this.id_cliente,
        ejercicio: 2023,
        descripcion: this.festivo.descripcion,
        fecha: this.festivo.fecha,
        token: '012354SDSDS01',
        activo: 1,
        id_usuario: 1,
      };

      // Realiza la solicitud para editar el festivo
      this.festivosService.guardarFestivos(json).subscribe((resp) => {
        if (resp.ok) {
          Swal.fire('Festivo editado', resp.data.mensaje, 'success');
          this.festivo.fecha = '';
          this.festivo.descripcion = '';
          this.obtenerfestivos();
        }
      });

      // Cierra el modal de edición
      document.getElementById('cerrar')!.click();
      this.modalActivo = false;
    }
  }
  nuevo(){
   this.festivo = new Festivos(0, 0, 0, '', '', '', 1, 0, 1);
  }
}




