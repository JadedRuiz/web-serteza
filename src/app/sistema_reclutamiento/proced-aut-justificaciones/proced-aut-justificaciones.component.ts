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
import { JustificacionService } from 'src/app/services/justificaciones/justificacion.service';
import { Justificacion } from 'src/app/models/Justificaciones';
import { globalAgent } from 'http';
@Component({
  selector: 'app-proced-aut-justificaciones',
  templateUrl: './proced-aut-justificaciones.component.html',
  styleUrls: ['./proced-aut-justificaciones.component.css']
})
export class ProcedAutJustificacionesComponent implements OnInit {
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
       justi = new Justificacion(0,0,'','','','',0,0,'','',0,'',0,'',0,'',0,'',0,'')
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
    checked: any = false;
      constructor(
        private modalService: NgbModal,
        private candidato_service: CandidatoService,
        private incapacidadService: IncapacidadService,
        private justiService: JustificacionService,
      ) {
        // Genera datos de prueba
        this.objEmpleados = '';
        // this.dataSource = '';
      }

      ngOnInit(): void {
        this.obtenerJustificaciones();
      }


      // PARA CHECKED
      checkOn(event:any){
         this.obtenerJustificaciones();
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
            // this.dataSource.data = object.data;
            // this.dataSource.paginator = this.paginator;
            // this.candidatos_busqueda = object.data;
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
                //  console.log('=>>this.candidatos',this.candidatos_busqueda[0].id_candidato)
                // this.dataSource.data = object.data;
                // this.dataSource.paginator = this.paginator;
              }
            });
        }
      }

      public IdCandidato = 0
      optionUsuario(value : any){
        // console.log(value.option.id.id_candidato);
        this.IdCandidato = value.option.id.id_candidato;
        this.obtenerJustificaciones()
      }




      // PARA JUSTIFICACIONES
      justificaciones:any

      obtenerJustificaciones(){
        this.justificaciones = [];
        let json = {
          id_justificacion: 0,
          id_cliente: this.id_cliente,
          id_candidato: this.IdCandidato,
          id_empresa: 0,
          id_sucursal: 0,
          id_departamento: 0,
          id_puesto: 0,
          sin_autorizar: this.checked ?  0 : 1,
          fecha_inicial: '',
          fecha_final: '',
          token: '012354SDSDS01',
        };
        console.log('olo',json);
        this.justiService.obternerJustificaciones(json).subscribe(resp => {
          if(resp.ok){
            this.justificaciones = resp.data
            console.log(this.justificaciones);
            // console.log(this.justificaciones);
          }
        })
      }


      // AUTORIZAR
      autorizar(id :any){
        Swal.fire({
          title: '¿Autorizar justificación?',
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Confirmar',
          denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            let json = {
              id_justificacion: id,
              token: '012354SDSDS01',
              id_usuario: 1,
            };

            this.justiService.autorizarJustificacion(json).subscribe(resp => {
              if(resp.ok){
                console.log(resp);
                Swal.fire(resp.data.mensaje, '', 'success')
              }else{
                Swal.fire(resp.data.mensaje, '', 'error')
              }
            })
          this.obtenerJustificaciones()

          }
        })

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

        openModal2(){
          this.modal = this.modalService.open(this.modal_mov,{
             size: 'lg', centered : true, backdropClass : 'light-blue-backdrop'});
      }




      // INCAPACIDADES

      // OBTENER

      obternerIncapacidades() {
        let json = {
          id_incapacidad: 0,
          id_cliente: 5,
          id_candidato: 1,
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
          id_cliente: 5,
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




    }
