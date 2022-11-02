import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocalidadService } from 'src/app/services/localidad/localidad.service';
import { COLOR } from 'src/config/config';
import { Empresa } from 'src/app/models/Empresa';
import { Direccion } from 'src/app/models/Direccion';
import { Fotografia } from 'src/app/models/Fotografia';
import { EmpresaService } from 'src/app/services/Empresa/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as jQuery from 'jquery';
import { FormControl} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CompartidoService } from 'src/app/services/Compartido/Compartido.service';


@Component({
  selector: 'app-conceptos',
  templateUrl: './conceptos.component.html',
  styleUrls: ['./conceptos.component.css']
})
export class ConceptosComponent implements OnInit {

  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
    // this.llegar();
  }

  llegar(){
    alert("LLEGO");
  }


}
