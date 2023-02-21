import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoClienteComponent } from './catalogo_cliente/cat_cliente.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { CatalogoTopeConceptosComponent } from './catalogo_tope_conceptos/catalogo_tope_conceptos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcedimientoEmpresaComponent } from '../sistema_super_admin/procedimiento_empresa/procedimiento_empresa.component';
import { SistemaAdminComponent } from './sistema_super_admin.component';
import { CatalogoSucursalComponent } from './catalogo_sucursal/catalogo_sucursal.component';

const routes: Routes = [
  {
  path : 'sistema_super_admin',
    component : SistemaAdminComponent,
    children : [
        { path : "dashboard", component : DashboardComponent},
        { path : "catalogo_cliente", component : CatalogoClienteComponent},
        { path : "catalogo_empresa", component : CatalogoEmpresaComponent},
        { path : "catalogo_usuario", component : CatalogoUsuarioComponent},
        { path : "catalogo_sucursal", component : CatalogoSucursalComponent},
        { path : "catalogo_tope_conceptos", component : CatalogoTopeConceptosComponent},
        { path : "procedimineto_empresa", component : ProcedimientoEmpresaComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaSuperAdminRoutingModule { }
