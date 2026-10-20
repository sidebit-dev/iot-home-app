import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosEvent, DadosEventForm } from './dados-events';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3333/ewent';

  create(dados: DadosEventForm): Observable<DadosEvent> {
    console.log('Dados enviados para criação do Event:', dados);
    return this.http.post<DadosEvent>(this.baseUrl, dados);
  }

  findAll(page: number = 0, size: number = 10): Observable<PageResult<DadosEvent>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DadosEvent>>(url);
  }

  findById(id: number): Observable<DadosEvent> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<DadosEvent>(url);
  }

  update(id: number, dados: DadosEventForm): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<void>(url, dados);
  }

  ativaDesativa(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}/ativo`;
    return this.http.patch<void>(url, null);
  }

  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Envia o array de números [1, 2, 3] no corpo da requisição
  excluirVarios(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}`, { body: ids });
  }
}

