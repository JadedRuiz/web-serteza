import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaFacturacionRoutingModule } from './sistema_facturacion.routes';
import { SistemaFacturacionComponent } from './sistema_facturacion.component';
import { CompartidoModule } from './compartido/compartido.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogoConceptosComponent } from './catalogo_conceptos/catalogo-conceptos.component';
import { ProcesoFacturadorComponent } from './proceso_facturador/proceso-facturador.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import { CatalogoSeriesComponent } from './catalogo_series/catalogo_series.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChartsModule } from 'ng2-charts';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { FacturasComponent } from './facturas/facturas.component';

@NgModule({
  declarations: [
    SistemaFacturacionComponent,
    DashboardComponent,
    CatalogoConceptosComponent,
    CatalogoSeriesComponent,
    CatalogoEmpresaComponent,
    ProcesoFacturadorComponent,
    FacturasComponent
  ],
  imports: [
    CommonModule,
    SistemaFacturacionRoutingModule,
    CompartidoModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    ChartsModule,
    MatExpansionModule,
    MatRadioModule,
    MatDatepickerModule
  ]
})
export class SistemaFacturacionModule { }
