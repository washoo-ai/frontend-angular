import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListComponent } from './pages/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'nuevo', component: ClienteFormComponent },
  { path: 'editar/:id', component: ClienteFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule {}
