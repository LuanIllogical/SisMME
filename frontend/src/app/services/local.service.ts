import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Local } from '../models/local.model';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private readonly apiUrl = 'http://localhost:3000/api/locais';

  constructor(private readonly http: HttpClient) {}

  listar(apenasAtivos = false): Observable<Local[]> {
    let params = new HttpParams();
    if (apenasAtivos) params = params.set('ativo', 'true');
    return this.http.get<Local[]>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<Local> {
    return this.http.get<Local>(`${this.apiUrl}/${id}`);
  }

  criar(local: Local): Observable<Local> {
    return this.http.post<Local>(this.apiUrl, local);
  }

  atualizar(id: string, local: Partial<Local>): Observable<Local> {
    return this.http.put<Local>(`${this.apiUrl}/${id}`, local);
  }

  alterarStatus(id: string, ativo: boolean): Observable<Local> {
    return this.http.patch<Local>(`${this.apiUrl}/${id}`, { ativo });
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
