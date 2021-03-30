import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CatalogoCandidatosComponent } from './recursos_humanos/catalogos/catalogo_candidato/cat_candidatos.component';
import { CatalogoClienteComponent } from './recursos_humanos/catalogos/catalogo_cliente/cat_cliente.component';
import { CatalogoEmpresaComponent } from './recursos_humanos/catalogos/catalogo_empresa/cat_empresa.component';

const routes: Routes = [
    {
        path : '',
        component : AdminComponent,
        children : [
            { path : "dashboard", component : DashboardComponent},
            { path : "catalogo_candidato", component : CatalogoCandidatosComponent},
            { path : "catalogo_candidato/:id", component : CatalogoCandidatosComponent},
            { path : "catalogo_empresa", component : CatalogoEmpresaComponent},
            { path : "catalogo_empresa/:id", component : CatalogoEmpresaComponent},
            { path : "catalogo_cliente", component : CatalogoClienteComponent},
            { path : "catalogo_cliente/:id", component : CatalogoClienteComponent},
            { path: '', redirectTo: '/login', pathMatch: 'full'}
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }