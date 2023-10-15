import { Component, OnInit } from '@angular/core';
import { COLOR } from 'src/config/config';


@Component({
  selector: 'app-proced-xml',
  templateUrl: './proced-xml.component.html',
  styleUrls: ['./proced-xml.component.css']
})
export class ProcedXmlComponent implements OnInit {
  public color = COLOR;

  constructor() { }

  ngOnInit(): void {
  }

}
