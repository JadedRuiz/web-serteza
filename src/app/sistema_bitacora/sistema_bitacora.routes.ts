import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SistemaControlComponent } from './sistema_bitacora.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
  path : 'sistema_bitacora',
    component : SistemaControlComponent,
    children : [
        { path : "dashboard", component : DashboardComponent},
        { path: '', redirectTo: '/login', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaControlRoutingModule { }