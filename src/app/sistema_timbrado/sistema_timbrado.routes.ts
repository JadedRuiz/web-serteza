import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { SistemaTimbradoComponent } from './sistema_timbrado.component';

const routes: Routes = [
  {
  path : 'sistema_timbrado',
    component : SistemaTimbradoComponent,
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
export class SistemaTimbradoRoutingModule { }