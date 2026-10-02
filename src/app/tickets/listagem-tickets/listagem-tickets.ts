import { Component, OnInit, inject } from '@angular/core';
import { TicketService } from '../ticket-service';
import { Observable } from 'rxjs';
import { DadosTicket } from '../dados-ticket';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';

@Component({
  selector: 'app-listagem-tickets',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './listagem-tickets.html',
  styleUrl: './listagem-tickets.scss',
})
export class ListagemTickets implements OnInit {

  service = inject(TicketService);
  router = inject(Router);
  toast = inject(ToastrService);
  listagem$!: Observable<PageResult<DadosTicket>>;
  paginaAtual = 0;
  tamanhoPagina = 5;

  ngOnInit(): void {
    this.listarTickets();
  }

  listarTickets() {
    this.listagem$ = this.service.findAll(this.paginaAtual, this.tamanhoPagina);
  }

  navegar(pagina: number) {
    this.paginaAtual = pagina;
    this.listarTickets();
  }

  navegarProximo(listagem: PageResult<DadosTicket>) {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DadosTicket>) {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (valor, i) => i);
  }

  registroInicial(listagem: PageResult<DadosTicket>) {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return listagem.number * listagem.size + 1;
  }

  registroFinal(listagem: PageResult<DadosTicket>) {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  prepararEdicao(idTicket: number) {
    // console.log(`Preparando edição do ticket com ID: ${id}`);
    this.router.navigate(['/paginas/create-ticket'], { queryParams: { id: idTicket } });
  }

  ativaDesativa(idTicket: number) {
    this.service.ativaDesativa(idTicket).subscribe(next => {
      this.toast.success('Ticket ativado/desativado com sucesso!', 'Sucesso'),
      this.listarTickets();
    });
  }
} 
