import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoEmpleadoComponent } from './catalogo_empleado/catalogo_empleado.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SistemaNominaComponent } from './sistema_nomina.component';

const routes: Routes = [
  {
  path : 'sistema_nomina',
    component : SistemaNominaComponent,
    children : [
        { path : "dashboard", component : DashboardComponent},
        { path : "catalogo_empleado", component : CatalogoEmpleadoComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaNominaRoutingModule { }