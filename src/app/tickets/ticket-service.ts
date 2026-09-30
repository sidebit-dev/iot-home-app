import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosTicket, DadosTicketForm } from './dados-ticket';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3333/tickets';

  createTicket(dados: DadosTicketForm): Observable<DadosTicket> {
    return this.http.post<DadosTicket>(this.baseUrl, dados);
  }

  findAll(page: number = 0, size: number = 10): Observable<PageResult<DadosTicket>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DadosTicket>>(url);
  }
}
