import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { COLOR } from 'src/config/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IncapacidadService } from 'src/app/services/incapacidades/incapacidad.service';
import { CandidatoService } from 'src/app/services/Candidato/candidato.service';
import { Incapacidad } from 'src/app/models/incapacidad';
import { Candidato } from 'src/app/models/Candidato';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-proced-incapacidad',
  templateUrl: './proced-incapacidad.component.html',
  styleUrls: ['./proced-incapacidad.component.css'],
})
export class ProcedIncapacidadComponent implements OnInit {
fotoIncapacidad ='https://th.bing.com/th/id/R.218d63aed1c5e714180a6b190913fb4f?rik=OiNmcrpCohbNsQ&pid=ImgRaw&r=0&sres=1&sresct=1'
public direccion: Direccion = new Direccion(
    0,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  );
  public fotografia = new Fotografia(0, '', '', '');
  public id_cliente = parseInt(window.sessionStorage.getItem('cliente') + '');
  public candidato = new Candidato(
    0,
    this.id_cliente,
    6,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    0,
    '',
    '',
    '',
    '',
    '',
    0,
    this.direccion,
    this.fotografia
  );
  incapacidad = new Incapacidad(0,0,0,'',0,'','',0,'',0)
  public candidatos: any;
  public color = COLOR;
  public status = -1; //Status default
  public palabra = '';
  filterControl = new FormControl();
  public candidatos_busqueda: any ;
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
  // incapacidades = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('content', { static: false }) modal_mov: any;
  fechaInicio = new FormControl(new Date());
  fechaFinal = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  showModal = false;
  selectedRowData: any;
  modal: any;
incapacidades:any=''
  constructor(
    private modalService: NgbModal,
    private candidato_service: CandidatoService,
    private incapacidadService: IncapacidadService
  ) {
    // Genera datos de prueba
    this.objEmpleados = '';
    // this.dataSource = '';
  }

  ngOnInit(): void {
    // this.obternerIncapacidades();

  }

  private generateTableData(): any[] {
    const tableData = [];
    for (let i = 1; i <= 3; i++) {
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
  editar = false;
  openModal(rowData: any) {
    this.editar = true;
    this.vaciarModelo();
    this.modal = this.modalService.open(this.modal_mov, {
      size: 'md',
      centered: true,
    });
    this.selectedRowData = rowData;
    this.incapacidad = rowData;
    console.log(this.incapacidad);
  }

  closeModal() {
    this.modal.close();
  }

  // BARRA DE BUSQUEDA
  mostrarCandidatos() {
    let json = {
      palabra: this.palabra.toUpperCase(),
      status: this.status,
      id_cliente: this.id_cliente,
      tipo: 1,
    };
    this.candidatos = [];
    this.candidato_service.obtenerCandidatos(json).subscribe((object: any) => {
      if (object.ok) {
        this.objEmpleados = object.data;
      }
    });
  }

  buscarCandidato() {
    this.palabra = this.filterControl.value;
    if (this.filterControl.value.length < 1) {
      this.mostrarCandidatos();
    }
    if (this.filterControl.value.length > 2) {
      this.autocomplete(this.filterControl.value);
    }
  }

  autocomplete(palabra: string) {
    //  this.candidatos_busqueda = [];
    if (palabra.length > 2) {
      let json = {
        nombre_candidato: this.palabra.toUpperCase(),
        status: this.status,
        id_cliente: this.id_cliente,
      };
      this.candidato_service
        .autoCompleteCandidato(json)
        .subscribe((object: any) => {
          if (object.ok) {
            this.objEmpleados = object.data;
            this.candidatos_busqueda = object.data;
          }
        });
    }
  }

  // INCAPACIDADES

  // OBTENER
  usuarioSeleccionado= {
    'id_candidato' :''
  }
  optionUsuario(value : any){
    this.usuarioSeleccionado = value.option.id;
    console.log(this.usuarioSeleccionado);
    console.log(this.usuarioSeleccionado.id_candidato);
    this.obternerIncapacidades()
  }

  obternerIncapacidades() {
    let json = {
      id_incapacidad: 0,
      id_cliente: this.id_cliente,
      id_candidato: this.usuarioSeleccionado.id_candidato,
      fecha_incial: '',
      fecha_final: '',
      solo_activos: 1,
      token: '012354SDSDS01',
    };
    this.incapacidadService.obternerIncapacidades(json).subscribe((resp) => {
      if (resp.ok) {
        // Swal.fire('Exito', resp.message, 'success');
        this.incapacidades = resp.data
      }
    });
  }




  // GUARDAR

  // FORMATEAR
  formatearFechaParaGuardar(fecha: any) {
    return formatDate(fecha, 'yyyy-MM-dd', 'en-US');
  }

  // CALCULAR
  calcularDiasIncapacidad() {
    const fechaInicial = new Date(this.incapacidad.fecha_inicial);
    const fechaFinal = new Date(this.incapacidad.fecha_final);

    // Calcula la diferencia en milisegundos entre las dos fechas
    const diferenciaMilisegundos = fechaFinal.getTime() - fechaInicial.getTime();

    // Convierte la diferencia en milisegundos a días
    const diasIncapacidad = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

    return diasIncapacidad;
  }

  // GUARDAR
  guardarIncapacidad() {
    const fechaInicialFormateada = this.formatearFechaParaGuardar(this.incapacidad.fecha_inicial);
    const fechaFinalFormateada = this.formatearFechaParaGuardar(this.incapacidad.fecha_final);
    const diasIncapacidad = this.calcularDiasIncapacidad();

    let json = {
      id_incapacidad: 0,
      id_cliente: this.id_cliente,
      id_candidato: this.candidatos_busqueda[0].id_candidato,
      folio: this.incapacidad.folio,
      dias_incapacidad: diasIncapacidad,
      fecha_inicial: fechaInicialFormateada,
      fecha_final: fechaFinalFormateada,
      activo: 1,
      token: '012354SDSDS01',
      id_usuario: 1,
    };
    console.log('json :>> ', json);
    this.incapacidadService.guardarIncapacidad(json).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire('Incapacidad Guardada', '', 'success');
      }
    });
    this.closeModal();
    this.obternerIncapacidades();

  }


  openModal2(){
    this.editar = false;

    this.vaciarModelo();
      this.modal = this.modalService.open(this.modal_mov,{
         size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
  }

  vaciarModelo(){
  this.incapacidad = new Incapacidad(0,0,0,'',0,'','',0,'',0)

  }

}
