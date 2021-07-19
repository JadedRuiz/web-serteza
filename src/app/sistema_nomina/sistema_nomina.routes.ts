import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoConceptoComponent } from './catalogo_concepto/catalogo_concepto.component';
import { CatalogoCuentaBancariaComponent } from './catalogo_cuenta_bancaria/catalogo_cuenta_bancaria.component';
import { CatalogoPeriodoComponent } from './catalogo_periodo/catalogo_periodo.component';
import { CatalogoPrestacionComponent } from './catalogo_prestacion/catalogo_prestacion.component';
import { CatalogoRegistroPatronalComponent } from './catalogo_registro_patronal/catalogo_registro_patronal.component';
import { CatalogoSucursalComponent } from './catalogo_sucursal/catalogo_sucursal.component';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';
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
        { path : "catalogo_concepto", component : CatalogoConceptoComponent},
        { path : "catalogo_periodo", component : CatalogoPeriodoComponent},
        { path : "catalogo_departamento", component : CatalogoDepartamentoComponent},
        { path : "catalogo_sucursal", component : CatalogoSucursalComponent},
        { path : "catalogo_prestacion", component : CatalogoPrestacionComponent},
        { path : "catalogo_cuenta_bancaria", component : CatalogoCuentaBancariaComponent},
        { path : "catalogo_registro_patronal", component : CatalogoRegistroPatronalComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaNominaRoutingModule { }