import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosLogSensor, DadosLogSensorForm } from './dados-log-sensor';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class LogSensorService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3333/ewent';

  create(dados: DadosLogSensorForm): Observable<DadosLogSensor> {
    console.log('Dados enviados para criação do logSensor:', dados);
    return this.http.post<DadosLogSensor>(this.baseUrl, dados);
  }

  findAll(page: number = 0, size: number = 10): Observable<PageResult<DadosLogSensor>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DadosLogSensor>>(url);
  }

  findById(id: number): Observable<DadosLogSensor> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<DadosLogSensor>(url);
  }

  update(id: number, dados: DadosLogSensorForm): Observable<void> {
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

