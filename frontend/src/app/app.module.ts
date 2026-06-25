import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent }    from './pages/dashboard/dashboard.component';
import { LocaisComponent }       from './pages/locais/locais.component';
import { NovoLocalComponent }    from './pages/novo-local/novo-local.component';
import { RegistrosComponent }    from './pages/registros/registros.component';
import { NovoRegistroComponent } from './pages/novo-registro/novo-registro.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LocaisComponent,
    NovoLocalComponent,
    RegistrosComponent,
    NovoRegistroComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
