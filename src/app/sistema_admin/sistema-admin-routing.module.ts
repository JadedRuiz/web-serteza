import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoClienteComponent } from './catalogo_cliente/cat_cliente.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SistemaAdminComponent } from './sistema-admin.component';

const routes: Routes = [
  {
  path : 'sistema_admin',
    component : SistemaAdminComponent,
    children : [
        { path : "dashboard", component : DashboardComponent},
        { path : "catalogo_cliente", component : CatalogoClienteComponent},
        { path : "catalogo_empresa", component : CatalogoEmpresaComponent},
        { path : "catalogo_usuario", component : CatalogoUsuarioComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaAdminRoutingModule { }
