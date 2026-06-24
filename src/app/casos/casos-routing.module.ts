import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CasoFormComponent } from './caso-form/caso-form.component';
import { CasoListComponent } from './casos-list/casos-list.component';

const routes: Routes = [

  // 📋 Listar casos
  { path: '', component: CasoListComponent },

  // ➕ Nuevo caso
  { path: 'nuevo', component: CasoFormComponent },

{ path: 'editar/:id', component: CasoFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasosRoutingModule { }