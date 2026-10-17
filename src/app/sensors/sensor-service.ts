import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DadosSensor, DadosSensorForm, FiltroSensor } from './dados-sensor';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';
import { DadosTicket } from '../tickets/dados-ticket';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3333/sensors';

  createSensor(dados: DadosSensorForm): Observable<DadosSensor> {
    console.log('Dados enviados para criação do sensor:', dados);
    return this.http.post<DadosSensor>(this.baseUrl, dados);
  }

  listarTicketsDisponiveis(): Observable<DadosTicket[]> {
    const url = `${this.baseUrl}/tickets-disponiveis`;
    return this.http.get<DadosTicket[]>(url);
  }

  findAll(page: number = 0, size: number = 10): Observable<PageResult<DadosSensor>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DadosSensor>>(url);
  }

  listar(filtros: FiltroSensor): Observable<PageResult<DadosSensor>> {
    let params = new HttpParams();
    if (filtros.status) {
      params = params.set('status', filtros.status);
    }
    if (filtros.ticket_id) {
      params = params.set('ticket_id', filtros.ticket_id);
    }
    let page = filtros.page ?? 0;
    let size = filtros.size ?? 10;
    params = params.set('page', page).set('size', size);
    const url = `${this.baseUrl}-filtro`;
    return this.http.get<PageResult<DadosSensor>>(url, { params: params });
  }

  listarTicketsParaFiltrar(): Observable<DadosTicket[]> {
    const url = 'http://localhost:3333/sensors-filtro/tickets-listagem';
    return this.http.get<DadosTicket[]>(url);
  }

  findById(id: number): Observable<DadosSensor> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<DadosSensor>(url);
  }

  updateSensor(id: number, dados: DadosSensorForm): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<void>(url, dados);
  }

  ativaDesativa(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}/ativo`;
    return this.http.patch<void>(url, null);
  }

  // deleteSensor(id: number): Observable<void> {
  //   const url = `${this.baseUrl}/${id}`;
  //   return this.http.delete<void>(url);
  // }
}
