import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule } from '@angular/forms';
import { SistemaPrestaSoftComponent } from './sistema_prestasoft.component';
import { SistemaPrestaSoftRoutingModule } from './sistema_prestasoft.routes';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';

@NgModule({
  declarations: [
    SistemaPrestaSoftComponent,
    XmlUploadComponent,
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
