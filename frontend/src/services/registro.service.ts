import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroMeteorologico } from '../models/registro-meteorologico.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private readonly apiUrl = 'http://localhost:3000/api/registros';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<RegistroMeteorologico[]> {
    return this.http.get<RegistroMeteorologico[]>(this.apiUrl);
  }

  criar(registro: RegistroMeteorologico): Observable<RegistroMeteorologico> {
    return this.http.post<RegistroMeteorologico>(this.apiUrl, registro);
  }
}
