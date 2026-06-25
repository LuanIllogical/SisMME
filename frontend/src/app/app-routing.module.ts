import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }    from './pages/dashboard/dashboard.component';
import { LocaisComponent }       from './pages/locais/locais.component';
import { NovoLocalComponent }    from './pages/novo-local/novo-local.component';
import { RegistrosComponent }    from './pages/registros/registros.component';
import { NovoRegistroComponent } from './pages/novo-registro/novo-registro.component';

const routes: Routes = [
  { path: '',               redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',      component: DashboardComponent },
  { path: 'locais',         component: LocaisComponent },
  { path: 'locais/novo',    component: NovoLocalComponent },
  { path: 'registros',      component: RegistrosComponent },
  { path: 'registros/novo', component: NovoRegistroComponent },
  { path: '**',             redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
