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
import { MovimientoBancosComponent } from '../sistema_prestasoft/procedimientos/movimiento-bancos/movimiento-bancos.component';
import { DescargaMasivaComponent } from './descarga-masiva/descarga-masiva.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { CurrencyPipe} from '@angular/common';
import { CalcularComponent } from './calcular_empleados/calcular/calcular.component';

@NgModule({
  declarations: [
    SistemaContabilidadComponent,
    XmlUploadComponent,
    FacturasComponent,
    BancosComponent,
    MovimientoBancosComponent,
    CatalogoEmpresaComponent,
    DescargaMasivaComponent,
    DashboardComponent,
    ConceptosComponent,
    CalcularComponent
  ],
  imports: [
    CommonModule,
    SistemaContabilidadRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
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
  ],
  providers : [
    CurrencyPipe
  ]
})
export class SitemaContabilidadModule { }
