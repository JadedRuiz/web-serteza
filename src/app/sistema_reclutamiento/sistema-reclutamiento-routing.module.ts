import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoCandidatosComponent } from './catalogo_candidato/cat_candidatos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SistemaReclutamientoComponent } from './sistema-reclutamiento.component';

const routes: Routes = [
  {
    path : 'sistema_reclutamiento',
    component : SistemaReclutamientoComponent,
    children : [
        { path : "dashboard",component : DashboardComponent},
        { path : "candidato", component : CatalogoCandidatosComponent},
        // { path : "catalogo_candidato/:id", component : CatalogoCandidatosComponent},
        // { path : "catalogo_empresa", component : CatalogoEmpresaComponent},
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
