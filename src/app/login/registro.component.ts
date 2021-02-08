import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public color = COLOR;
  constructor() { }

  ngOnInit(): void {
  }

}
