import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BancosComponent } from './bancos/bancos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { SistemaContabilidadComponent } from './sistema_contabilidad.component';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';


const routes: Routes = [
    {
    path : 'contabilidad',
      component : SistemaContabilidadComponent,
      children : [
          { path: 'dashboard', component : DashboardComponent},
          { path: 'xml-upload', component : XmlUploadComponent},
          { path: 'facturas', component : FacturasComponent},
          { path: 'bancos', component : BancosComponent},  
          { path : 'catalogo_empresa', component : CatalogoEmpresaComponent},
          { path: '', redirectTo: '/login', pathMatch: 'full'}
      ]
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
    export class SistemaContabilidadRoutingModule { }
