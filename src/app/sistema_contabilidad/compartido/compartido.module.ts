import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SubirXmlComponent } from '../components/subir-xml/subir-xml.component';



@NgModule({
  declarations: [
    SidebarComponent, 
    HeaderComponent,
    SubirXmlComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AutocompleteLibModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  exports : [
    HeaderComponent,
    SidebarComponent
  ]
})
export class CompartidoModule { }
