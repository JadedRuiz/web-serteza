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

@NgModule({
  declarations: [
    SistemaReclutamientoComponent,
    DashboardComponent,
    CatalogoCandidatosComponent,
    ProcedimientoContratacionComponent
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
  ]
})
export class SistemaReclutamientoModule { }
