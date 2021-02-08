import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";



@NgModule({
  declarations: [SidebarComponent, HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    AutocompleteLibModule,
    NgbModule
  ],
  exports : [
    HeaderComponent,
    SidebarComponent
  ]
})
export class CompartidoModule { }
