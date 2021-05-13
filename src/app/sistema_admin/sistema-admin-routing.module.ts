import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcedimientoEmpresaComponent } from './procedimiento_empresa/procedimiento_empresa.component';
import { ProcedimientoUsuarioComponent } from './procedimiento_usuario/procedimiento_usuario.component';
import { SistemaAdminComponent } from './sistema-admin.component';

const routes: Routes = [
  {
  path : 'sistema_admin',
    component : SistemaAdminComponent,
    children : [
        { path : "dashboard", component : DashboardComponent},
        { path : "catalogo_usuario", component : CatalogoUsuarioComponent},
        { path : "catalogo_departamento", component : CatalogoDepartamentoComponent},
        { path : "procedimiento_usuario", component : ProcedimientoUsuarioComponent},
        { path : "procedimineto_empresa", component : ProcedimientoEmpresaComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaAdminRoutingModule { }
