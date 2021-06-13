import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoClienteComponent } from './catalogo_cliente/cat_cliente.component';
import { SistemaSuperAdminRoutingModule } from './sistema_super_admin_routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompartidoModule } from './compartido/compartido.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SistemaAdminComponent } from './sistema_super_admin.component';
import { CatalogoUsuarioComponent } from './catalogo_usuario/catalogo_usuario.component';
import { CatalogoEmpresaComponent } from './catalogo_empresa/catalogo_empresa.component';
import { ProcedimientoUsuarioComponent } from './procedimiento_usuario/procedimiento_usuario.component';
import { WebcamModule } from 'ngx-webcam';
import { ProcedimientoEmpresaComponent } from './procedimiento_empresa/procedimiento_empresa.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    SistemaAdminComponent,
    CatalogoClienteComponent,
    CatalogoUsuarioComponent,
    CatalogoEmpresaComponent,
    ProcedimientoUsuarioComponent,
    ProcedimientoEmpresaComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    SistemaSuperAdminRoutingModule,
    CompartidoModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SistemaSuperAdminModule { }
