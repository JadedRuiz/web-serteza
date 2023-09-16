import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';

@Component({
  selector: 'app-modal-integra',
  templateUrl: './modal-integra.component.html',
  styleUrls: ['./modal-integra.component.css']
})
export class ModalIntegraComponent implements OnInit {
  trabajadorV: { variables: any[] } = { variables: [] };
  totalImportes: number = 0;
  totalGravadosIMSS: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalIntegraComponent>,
    private calcularService: CalculoService,

    @Inject(MAT_DIALOG_DATA) public trabajador: any

  ) { }

  ngOnInit(): void {
    this.detalleTrabajador();
  }


  cerrarModal(): void {
    this.dialogRef.close();
  }


  detalleTrabajador(){
    let json = {
      id_empresa: this.trabajador.id_empresa,
      rfc: this.trabajador.rfc,
      bimestre: 1 ,
      ejercicio: this.trabajador.ejercicio,
      registro_patronal: this.trabajador.registro_patronal,
      exportar: 0
    }

    this.calcularService.variables(json)
    .subscribe((obj:any)=>{
      if(obj.ok){
        console.log('obj.data :>> ', obj.data);
        this.trabajadorV.variables = obj.data[0].variables;
        console.log('trabajadorV :>> ', this.trabajadorV);
        this.calcularTotales();
      }
    })
  }


  calcularTotales() {
    this.totalImportes = this.trabajadorV.variables.reduce((total, variable) => {
      return total + parseFloat(variable.importe);
    }, 0);

    this.totalGravadosIMSS = this.trabajadorV.variables.reduce((total, variable) => {
      return total + parseFloat(variable.gravado_imss);
    }, 0);
  }

}
