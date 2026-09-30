import { Component, OnInit, inject } from '@angular/core';
import { TicketService } from '../ticket-service';
import { Observable } from 'rxjs';
import { DadosTicket } from '../dados-ticket';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listagem-tickets',
  imports: [CommonModule],
  templateUrl: './listagem-tickets.html',
  styleUrl: './listagem-tickets.scss',
})
export class ListagemTickets implements OnInit {

  service = inject(TicketService);
  listagem$!: Observable<PageResult<DadosTicket>>;
  pageNumber = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.listarTickets();
  }

  listarTickets(): void {
    this.listagem$ = this.service.findAll(this.pageNumber, this.pageSize);
  }

  navegarPagina(pagina: number): void {
    this.pageNumber = pagina;
    this.listarTickets();
  }
}
