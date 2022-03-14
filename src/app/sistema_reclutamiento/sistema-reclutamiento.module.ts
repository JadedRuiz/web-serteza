import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SistemaReclutamientoComponent } from './sistema-reclutamiento.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompartidoModule } from './compartido/compartido.module';
import { CatalogoCandidatosComponent } from './catalogo_candidato/cat_candidatos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SistemaReclutamientoRoutingModule } from './sistema-reclutamiento-routing.module';
import { ProcedimientoContratacionComponent } from './procedimiento_contratacion/procedimiento_contratacion.component';
import { WebcamModule } from 'ngx-webcam';
import { ProcedimientoBajaComponent } from './procedimiento_baja/procedimiento_baja.component';
import { ProcedimientoModificacionComponent } from './procedimiento_modificacion/procedimiento_modificacion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CompartidoModuleGeneral } from 'src/app/compartido/compartido.module';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { CatalogoSucursalComponent } from './catalogo_sucursal/catalogo_sucursal.component';
import { ComponentesModule } from '../componentes/compartido.module';

@NgModule({
  declarations: [
    SistemaReclutamientoComponent,
    DashboardComponent,
    CatalogoCandidatosComponent,
    CatalogoDepartamentoComponent,
    CatalogoUsuarioComponent,
    CatalogoEmpresaComponent,
    CatalogoSucursalComponent,
    ProcedimientoContratacionComponent,
    ProcedimientoBajaComponent,
    ProcedimientoModificacionComponent
  ],
  imports: [
    CompartidoModule,
    ComponentesModule,
    SistemaReclutamientoRoutingModule,
    BrowserModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WebcamModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CompartidoModuleGeneral,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatListModule
  ],
  providers: [CurrencyPipe]
})
export class SistemaReclutamientoModule { }
