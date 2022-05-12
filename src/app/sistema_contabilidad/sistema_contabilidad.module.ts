import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SistemaContabilidadComponent } from './sistema_contabilidad.component';
import { SistemaContabilidadRoutingModule } from './sistema_contabilidad.routes';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { FacturasComponent } from './facturas/facturas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BancosComponent } from './bancos/bancos.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import  {MatSelectModule } from '@angular/material/select';

 

@NgModule({
  declarations: [
    SistemaContabilidadComponent,
    XmlUploadComponent,
    FacturasComponent,
    BancosComponent,
    CatalogoEmpresaComponent
  ],
  imports: [
    CommonModule,
    SistemaContabilidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgbModule,
    CompartidoModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule
  ]
})
export class SitemaPrestasoftModule { }
