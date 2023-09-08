import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';

@Component({
  selector: 'app-edit-trabajador',
  templateUrl: './edit-trabajador.component.html',
  styleUrls: ['./edit-trabajador.component.css'],
})
export class EditTrabajadorComponent implements OnInit {
  idObtenido: any;
  nomina: any = {};
  fechaActual: Date = new Date();
  displayedColumns: string[] = [
    "departamento",
    "id_detallenomina",
    "tipo",
    "clave",
    "concepto",
    "importe",
    "importe_gravado",
    "clave_tipo",
    "gravado_imss",
    "periodo",
    "ejercicio",
  ];

  dataSource: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private calculoService: CalculoService,
  ) {}

  ngOnInit(): void {
    this.cargautil();
    this.fechaActual = new Date();

  }

  cargautil() {
    // Obtener los datos del empleado desde la ruta activa
    this.route.queryParams.subscribe((params) => {
      this.idObtenido = params;
      console.log('this.idObtenido :>> ', this.idObtenido);
    });
    this.obtenerRegistros();
  }

  // ENVIAR ID_BOVEDA
  obtenerRegistros() {
    let json = {
      id_boveda: 350006, // Usa this.idObtenido si está definido, de lo contrario, usa 350006
    };
    this.calculoService.detalleXML(json).subscribe((obj: any) => {
      if (obj.ok) {
        // Asigna los datos del primer objeto de la respuesta a la variable nomina
        this.dataSource = obj.data;
        this.nomina = obj.data;
        console.log('object :>> ', this.nomina);
      } else {
        // Manejo de error o mensaje de que no se encontraron datos
      }
    });
  }

 getfecha(): Date{
  return new Date();
 }





}
