import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CasoListComponent } from './casos-list/casos-list.component';
import { CasoFormComponent } from './caso-form/caso-form.component';
import { CasosRoutingModule } from './casos-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  { path: '', component: CasoListComponent },
  { path: 'nuevo', component: CasoFormComponent },
  { path: 'editar/:id', component: CasoFormComponent }
];
@NgModule({
  declarations: [
    CasoListComponent,
    CasoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CasosRoutingModule,
    NgSelectModule
  ]
})
export class CasosModule { }