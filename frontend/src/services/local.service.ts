import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Local } from '../models/local.model';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private readonly apiUrl = 'http://localhost:3000/api/locais';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Local[]> {
    return this.http.get<Local[]>(this.apiUrl);
  }

  criar(local: Local): Observable<Local> {
    return this.http.post<Local>(this.apiUrl, local);
  }
}
