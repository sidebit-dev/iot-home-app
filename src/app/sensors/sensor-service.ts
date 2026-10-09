import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DadosSensor, DadosSensorForm } from './dados-sensor';
import { Observable } from 'rxjs';
import { PageResult } from '../common/pagination/page-result';

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

  findAll(page: number = 0, size: number = 10): Observable<PageResult<DadosSensor>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<DadosSensor>>(url);
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
