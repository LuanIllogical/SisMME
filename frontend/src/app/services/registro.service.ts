import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroMeteorologico } from '../models/registro-meteorologico.model';

export interface FiltrosRegistro {
  localId?: string;
  dataInicio?: string;
  dataFim?: string;
  tempMin?: number;
  tempMax?: number;
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly apiUrl = 'http://localhost:3000/api/registros';

  constructor(private readonly http: HttpClient) {}

  listar(filtros?: FiltrosRegistro): Observable<RegistroMeteorologico[]> {
    let params = new HttpParams();
    if (filtros?.localId)    params = params.set('local', filtros.localId);
    if (filtros?.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros?.dataFim)    params = params.set('dataFim', filtros.dataFim);
    if (filtros?.tempMin != null) params = params.set('tempMin', String(filtros.tempMin));
    if (filtros?.tempMax != null) params = params.set('tempMax', String(filtros.tempMax));
    return this.http.get<RegistroMeteorologico[]>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<RegistroMeteorologico> {
    return this.http.get<RegistroMeteorologico>(`${this.apiUrl}/${id}`);
  }

  criar(registro: RegistroMeteorologico): Observable<RegistroMeteorologico> {
    return this.http.post<RegistroMeteorologico>(this.apiUrl, registro);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
