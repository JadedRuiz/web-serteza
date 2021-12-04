import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { SistemaFacturacionComponent } from './sistema_facturacion.component';

const routes: Routes = [
  {
  path : 'sistema_facturacion',
    component : SistemaFacturacionComponent,
    children : [
        { path : "inicio", component : InicioComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaFacturacionRoutingModule { }