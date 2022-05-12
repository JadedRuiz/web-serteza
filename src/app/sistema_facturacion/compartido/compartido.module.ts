import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sistema_facturacion/compartido/sidebar/sidebar.component';
import { HeaderComponent } from '../../sistema_facturacion/compartido/header/header.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SidebarComponent, 
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AutocompleteLibModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports : [
    HeaderComponent,
    SidebarComponent
  ]
})
export class CompartidoModule { }
