import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COLOR } from 'src/config/config';

@Component({
  selector: 'app-catalogo-puntos-acceso',
  templateUrl: './catalogo-puntos-acceso.component.html',
  styleUrls: ['./catalogo-puntos-acceso.component.css']
})
export class CatalogoPuntosAccesoComponent implements OnInit {
  public perfilStock : any =
  'https://th.bing.com/th/id/R.20836a4a6bf6d8ee3031d28e133a9eb7?rik=gG%2bcRJRZ4jd0Cw&riu=http%3a%2f%2fconstantcontinuity.com%2fconstantcontinuity%2fimages%2fbig1.png&ehk=TtGb2WLFcbckjNT98147tFsMNaunQxrZpJ2JeMw0i84%3d&risl=&pid=ImgRaw&r=0';
public color = COLOR;

perfiles = []
objEmpleados = []
filterControlEmpleados = new FormControl();
filterControl = new FormControl();
mainImage: string = '';
formUsuario = true;

  constructor() { }

  ngOnInit(): void {
  }

  buscarCandidato(){ }
  guardarUsuario(){}

}
