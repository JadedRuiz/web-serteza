import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoClienteComponent } from './catalogo_cliente/cat_cliente.component';
import { SistemaAdminRoutingModule } from './sistema-admin-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule } from '@angular/forms';
import { SistemaAdminComponent } from './sistema-admin.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { ProcedimientoUsuarioComponent } from './procedimiento_usuario/procedimiento_usuario.component';
import { ProcedimientoEmpresaComponent } from './procedimiento_empresa/procedimiento_empresa.component';
import { CatalogoDepartamentoComponent } from './catalogo_departamento/catalogo_departamento.component';


@NgModule({
  declarations: [
    SistemaAdminComponent,
    CatalogoClienteComponent,
    CatalogoUsuarioComponent,
    CatalogoEmpresaComponent,
    ProcedimientoUsuarioComponent,
    ProcedimientoEmpresaComponent,
    CatalogoDepartamentoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SistemaAdminRoutingModule,
    CompartidoModule,
    FormsModule
  ]
})
export class SistemaAdminModule { }
