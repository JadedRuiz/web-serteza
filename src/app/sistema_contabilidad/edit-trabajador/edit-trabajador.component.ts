import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CalculoService } from 'src/app/services/calculoIntegrado/calculo.service';

@Component({
  selector: 'app-edit-trabajador',
  templateUrl: './edit-trabajador.component.html',
  styleUrls: ['./edit-trabajador.component.css']
})
export class EditTrabajadorComponent implements OnInit {
  idObtenido: any;

  constructor(
    private route: ActivatedRoute,
    private calculoService: CalculoService
  ) { }

  ngOnInit(): void {
    this.cargautil();
  }
  dataSource = new MatTableDataSource<any>();
  nomina: any =[] = [];



//CARGA
cargautil(){
   // Obtener los datos del empleado desde la ruta activa
   this.route.queryParams.subscribe(params => {
    this.idObtenido = params;
    console.log('this.idObtenido :>> ', this.idObtenido);
  });
  this.obtenerRegistros();

}

//ENVIAR ID_BOVEDA
obtenerRegistros(){
  let json = {
    id_boveda : 350006 || this.idObtenido
  }
  this.calculoService.detalleXML(json).subscribe((obj:any)=>{
    if (obj.ok){
      this.nomina = obj.data
      console.log('object :>> ', this.nomina);

    }else{

    }
  })

}


}
