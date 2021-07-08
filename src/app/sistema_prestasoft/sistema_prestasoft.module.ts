import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SistemaPrestaSoftComponent } from './sistema_prestasoft.component';
import { SistemaPrestaSoftRoutingModule } from './sistema_prestasoft.routes';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { FacturasComponent } from './facturas/facturas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BancosComponent } from './bancos/bancos.component';

 

@NgModule({
  declarations: [
    SistemaPrestaSoftComponent,
    XmlUploadComponent,
    FacturasComponent,
    BancosComponent,
  ],
  imports: [
    CommonModule,
    SistemaPrestaSoftRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgbModule,
    CompartidoModule,
    MatAutocompleteModule,
    MatFormFieldModule
  ]
})
export class SitemaPrestasoftModule { }
