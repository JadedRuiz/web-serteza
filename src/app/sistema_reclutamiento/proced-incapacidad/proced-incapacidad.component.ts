import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';


@Component({
  selector: 'app-proced-incapacidad',
  templateUrl: './proced-incapacidad.component.html',
  styleUrls: ['./proced-incapacidad.component.css']
})
export class ProcedIncapacidadComponent implements OnInit {
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
