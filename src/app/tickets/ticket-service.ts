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

  findById(id: number): Observable<DadosTicket> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<DadosTicket>(url);
  }

  // updateTicket(id: number, dados: DadosTicketForm): Observable<DadosTicket> {
  //   const url = `${this.baseUrl}/${id}`;
  //   return this.http.put<DadosTicket>(url, dados);
  // }

  // deleteTicket(id: number): Observable<void> {
  //   const url = `${this.baseUrl}/${id}`;
  //   return this.http.delete<void>(url);
  // }
}
