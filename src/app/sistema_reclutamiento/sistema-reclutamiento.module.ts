import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CompartidoModuleGeneral } from 'src/app/compartido/compartido.module';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { ProcedimientoCapturaComponent } from './procedimiento_captura/procedimiento_captura.component';

@NgModule({
  declarations: [
    SistemaReclutamientoComponent,
    DashboardComponent,
    CatalogoCandidatosComponent,
    CatalogoDepartamentoComponent,
    CatalogoUsuarioComponent,
    ProcedimientoCapturaComponent,
    ProcedimientoContratacionComponent,
    ProcedimientoBajaComponent,
    ProcedimientoModificacionComponent
  ],
  imports: [
    CompartidoModule,
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
    CompartidoModuleGeneral
  ]
})
export class SistemaReclutamientoModule { }
