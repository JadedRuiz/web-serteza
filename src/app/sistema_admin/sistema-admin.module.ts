import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoClienteComponent } from './catalogo_cliente/cat_cliente.component';
import { SistemaAdminRoutingModule } from './sistema-admin-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule } from '@angular/forms';
import { SistemaAdminComponent } from './sistema-admin.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';


@NgModule({
  declarations: [
    SistemaAdminComponent,
    CatalogoClienteComponent,
    CatalogoUsuarioComponent
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
