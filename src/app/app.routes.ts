import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './layout/main/main.component';

export const routes: Routes = [

  // 👉 Al iniciar, enviar al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 👉 Ruta de login (fuera del layout)
  { path: 'login', component: LoginComponent },

  // 👉 Layout principal SOLO para las páginas internas
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./clientes/clientes.module').then((m) => m.ClientesModule)
        
      },
       // ⚖️ CASOS (NUEVO)
      {
        path: 'casos',
        loadChildren: () =>
          import('./casos/casos.module').then((m) => m.CasosModule)
      },

       {
        path: 'caso/:id',
        loadComponent: () =>
          import('./casos/caso-detalle/caso-detalle.component')
            .then(m => m.CasoDetalleComponent)
      }


      

    ]
  
    
  },
  

  // 👉 Rutas inválidas regresan al login
  { path: '**', redirectTo: 'login' }
];
