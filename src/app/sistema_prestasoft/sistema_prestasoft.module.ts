import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule } from '@angular/forms';
import { SistemaPrestaSoftComponent } from './sistema_prestasoft.component';
import { SistemaPrestaSoftRoutingModule } from './sistema_prestasoft.routes';

@NgModule({
  declarations: [
    SistemaPrestaSoftComponent,
    
  ],
  imports: [
    CommonModule,
    SistemaPrestaSoftRoutingModule,
    FormsModule,
    NgbModule,
    CompartidoModule
  ]
})
export class SitemaPrestasoftModule { }
