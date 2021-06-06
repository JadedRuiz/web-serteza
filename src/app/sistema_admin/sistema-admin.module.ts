import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SistemaAdminRoutingModule } from './sistema-admin-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule } from '@angular/forms';
import { SistemaAdminComponent } from './sistema-admin.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { ProcedimientoUsuarioComponent } from './procedimiento_usuario/procedimiento_usuario.component';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { WebcamModule } from 'ngx-webcam';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    SistemaAdminComponent,
    CatalogoUsuarioComponent,
    ProcedimientoUsuarioComponent,
    CatalogoDepartamentoComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SistemaAdminRoutingModule,
    CompartidoModule,
    FormsModule,
    WebcamModule
  ]
})
export class SistemaAdminModule { }
