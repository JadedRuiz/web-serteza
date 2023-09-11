import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BancosComponent } from './bancos/bancos.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { FacturasComponent } from './facturas/facturas.component';
import { XmlUploadComponent } from './xml-upload/xml-upload.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { SistemaContabilidadComponent } from './sistema_contabilidad.component';
import { DescargaMasivaComponent } from './descarga-masiva/descarga-masiva.component';
import { MovBancosComponent } from './mov-bancos/mov-bancos.component';
import { CalcularComponent } from './calcular_empleados/calcular/calcular.component';
import { RevisarXmlComponent } from './revisar-xml/revisar-xml.component';
import { EditTrabajadorComponent } from './edit-trabajador/edit-trabajador.component';
import { AcumuladosDeNominaComponent } from './acumulados-de-nomina/acumulados-de-nomina.component';


const routes: Routes = [
    {
    path : 'contabilidad',
      component : SistemaContabilidadComponent,
      children : [
          { path: 'dashboard', component : DashboardComponent},
          { path: 'xml-upload', component : XmlUploadComponent},
          { path: 'facturas', component : FacturasComponent},
          { path: 'bancos', component : BancosComponent},
          { path: 'conceptos', component : ConceptosComponent},
          { path : 'catalogo_empresa', component : CatalogoEmpresaComponent},
          { path : 'descarga-masiva', component : DescargaMasivaComponent},
          { path : 'calcular', component: CalcularComponent},
          { path : 'revisar', component: RevisarXmlComponent},
          { path : 'mov-banco', component : MovBancosComponent},
          { path : 'edit-trab', component: EditTrabajadorComponent},
          { path: 'acumulados-nomina', component: AcumuladosDeNominaComponent},
          { path: '', redirectTo: '/login', pathMatch: 'full'}
      ]
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
    export class SistemaContabilidadRoutingModule { }
