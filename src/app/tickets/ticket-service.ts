import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosTicket, DadosTicketForm } from './dados-ticket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);

  createTicket(dados: DadosTicketForm) : Observable<DadosTicket>{
    const url = 'http://localhost:3333/tickets';
    return this.http.post<DadosTicket>(url, dados);
  }
}
