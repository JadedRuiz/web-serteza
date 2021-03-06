import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoCandidatosComponent } from './catalogo_candidato/cat_candidatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcedimientoContratacionComponent } from './procedimiento_contratacion/procedimiento_contratacion.component';
import { SistemaReclutamientoComponent } from './sistema-reclutamiento.component';

const routes: Routes = [
  {
    path : 'sistema_reclutamiento',
    component : SistemaReclutamientoComponent,
    children : [
        { path : "dashboard",component : DashboardComponent},
        { path : "catalogo_candidato", component : CatalogoCandidatosComponent},
        { path : "solicitudes", component : CatalogoCandidatosComponent},
        { path : "procedimiento_contratacion", component : ProcedimientoContratacionComponent},
        // { path : "catalogo_empresa/:id", component : CatalogoEmpresaComponent},
        // { path : "catalogo_cliente", component : CatalogoClienteComponent},
        // { path : "catalogo_cliente/:id", component : CatalogoClienteComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaReclutamientoRoutingModule { }
