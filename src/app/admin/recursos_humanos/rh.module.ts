import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { CatalogoCandidatosComponent } from './catalogos/catalogo_candidato/cat_candidatos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogoClienteComponent } from './catalogos/catalogo_cliente/cat_cliente.component';



@NgModule({
  declarations: [
      CatalogoCandidatosComponent,
      CatalogoClienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports : [
    CatalogoCandidatosComponent,
    CatalogoClienteComponent    
  ]
})
export class RhModule { }