import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistroMeteorologico } from '../app/models/registro-meteorologico.model';

export interface FiltrosRegistro {
  localId?: string;
  dataInicio?: string;
  dataFim?: string;
  tempMin?: number;
  tempMax?: number;
}

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private readonly apiUrl = '/api/registros';

  constructor(private readonly http: HttpClient) {}

  listar(filtros?: FiltrosRegistro): Observable<RegistroMeteorologico[]> {
    const p = new URLSearchParams();
    if (filtros?.localId)         p.set('local',      filtros.localId);
    if (filtros?.dataInicio)      p.set('dataInicio',  filtros.dataInicio);
    if (filtros?.dataFim)         p.set('dataFim',     filtros.dataFim);
    if (filtros?.tempMin != null) p.set('tempMin',     String(filtros.tempMin));
    if (filtros?.tempMax != null) p.set('tempMax',     String(filtros.tempMax));
    const qs = p.toString();
    return this.http.get<RegistroMeteorologico[]>(qs ? `${this.apiUrl}?${qs}` : this.apiUrl);
  }

  criar(registro: RegistroMeteorologico): Observable<RegistroMeteorologico> {
    return this.http.post<RegistroMeteorologico>(this.apiUrl, registro);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
