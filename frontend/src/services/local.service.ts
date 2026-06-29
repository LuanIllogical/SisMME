import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Local } from '../models/local.model';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private readonly apiUrl = '/api/locais';

  constructor(private readonly http: HttpClient) {}

  listar(apenasAtivos = false): Observable<Local[]> {
    const url = apenasAtivos ? `${this.apiUrl}?ativo=true` : this.apiUrl;
    return this.http.get<Local[]>(url);
  }

  criar(local: Local): Observable<Local> {
    return this.http.post<Local>(this.apiUrl, local);
  }

  alterarStatus(id: string, ativo: boolean): Observable<Local> {
    return this.http.patch<Local>(`${this.apiUrl}/${id}`, { ativo });
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}