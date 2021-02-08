import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { RecursosHumanosComponent } from './recursos_humanos/recursos_humanos.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path : '',
        component : AdminComponent,
        children : [
            { path : "recursos_humanos", component : RecursosHumanosComponent},
            { path : "recursos_humanos/:id", component : RecursosHumanosComponent},
            { path : "dashboard", component : DashboardComponent},

            { path: '', redirectTo: '/login', pathMatch: 'full'}
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }