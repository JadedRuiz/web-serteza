import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../sistema_prestasoft/dashboard/dashboard.component';
import { SistemaPrestaSoftComponent } from './sistema_prestasoft.component';


const routes: Routes = [
    {
    path : 'sistema_prestasoft',
      component : SistemaPrestaSoftComponent,
      children : [
          { path: 'dashboard', component : DashboardComponent},
          { path: '', redirectTo: '/login', pathMatch: 'full'}
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class SistemaPrestaSoftRoutingModule { }