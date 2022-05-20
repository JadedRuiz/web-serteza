import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SistemaFacturacionComponent } from './sistema_facturacion.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcesoFacturadorComponent } from './proceso_facturador/proceso-facturador.component';
import { CatalogoConceptosComponent } from './catalogo_conceptos/catalogo-conceptos.component';
import { CatalogoSeriesComponent } from './catalogo_series/catalogo_series.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { FacturasComponent } from './facturas/facturas.component';

const routes: Routes = [
  {
  path : 'sistema_facturacion',
    component : SistemaFacturacionComponent,
    children : [
        { path : "dashboard", component : DashboardComponent },
        { path : "catalogo_concepto", component : CatalogoConceptosComponent },
        { path : "catalogo_empresa", component : CatalogoEmpresaComponent },
        { path : "catalogo_serie", component : CatalogoSeriesComponent },
        { path : "proceso_facturas", component : FacturasComponent },
        { path : "proceso_facturador", component : ProcesoFacturadorComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaFacturacionRoutingModule { }
