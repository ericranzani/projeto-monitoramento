import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Ativo {
  id: number;
  nome_ativo: string;
  status: string;
  carga_cpu: number;
  ultima_atualizacao: string;
}

@Injectable({
  providedIn: 'root',
})
export class AtivoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/ativos';

  listarAtivos(): Observable<Ativo[]> {
    return this.http.get<Ativo[]>(this.apiUrl);
  }

  deletarAtivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  atualizarAtivo(id: number, ativo: Ativo): Observable<Ativo> {
    return this.http.put<Ativo>(`${this.apiUrl}/${id}`, ativo);
  }
}

