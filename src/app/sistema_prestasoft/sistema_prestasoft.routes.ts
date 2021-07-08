import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../sistema_prestasoft/dashboard/dashboard.component';
import { BancosComponent } from './bancos/bancos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { SistemaPrestaSoftComponent } from './sistema_prestasoft.component';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';


const routes: Routes = [
    {
    path : 'contabilidad',
      component : SistemaPrestaSoftComponent,
      children : [
          { path: 'dashboard', component : DashboardComponent},
          { path: 'xml-upload', component : XmlUploadComponent},
          { path: 'facturas', component : FacturasComponent},
          { path: 'bancos', component : BancosComponent},  
          { path: '', redirectTo: '/login', pathMatch: 'full'}
      ]
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
    export class SistemaPrestaSoftRoutingModule { }
