import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../events-service';
import { Observable, tap } from 'rxjs';
import { DadosEvent } from '../dados-events';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';

@Component({
  selector: 'app-list-log-sensors',
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './list-events.html',
  styleUrl: './list-events.scss',
})
export class ListEvents implements OnInit {
  service = inject(EventService);
  router = inject(Router);
  toast = inject(ToastrService);
  listagem$!: Observable<PageResult<DadosEvent>>;
  listagem!: PageResult<DadosEvent>
  paginaAtual = 0;
  tamanhoPagina = 8;

  ngOnInit(): void {
    this.ListEvents();
  }

  ListEvents() {
    this.listagem$ = this.service.findAll(this.paginaAtual, this.tamanhoPagina).pipe(tap(dadosListagem => {
      this.listagem = dadosListagem

    }));
  }

  deletar(id: number): void {
    this.service.delete(id).subscribe({
      next: () => {
        this.toast.success('Evento deletado com sucesso!', 'Sucesso');
        this.ListEvents();
      },
      error: () => {
        this.toast.error('Erro ao deletar evento', 'Erro');
      }
    });
  }

  excluirTodos() {
    if (confirm('Tem certeza que deseja excluir os itens selecionados?')) {


      this.service.excluirTodos(this.listagem.content.map(content => content.id)).subscribe({
        next: () => {
          this.toast.success('Eventos deletados com sucesso!', 'Sucesso');
          //  alert('Produtos excluídos com sucesso!');

          this.ListEvents(); // Atualiza a tabela na tela

          if (!this.listagem.first) {
            this.navegar(this.listagem.number - 1);
          }
        },
        error: (err) => {
          this.toast.error('Erro ao deletar TODOS Eventos', 'Erro');
          // console.error('Erro ao excluir produtos', err);
        }
      })
    }
  }

  navegar(pagina: number) {
    this.paginaAtual = pagina;
    this.ListEvents();
  }

  navegarProximo(listagem: PageResult<DadosEvent>) {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DadosEvent>) {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (valor, i) => i);
  }

  registroInicial(listagem: PageResult<DadosEvent>) {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return listagem.number * listagem.size + 1;
  }

  registroFinal(listagem: PageResult<DadosEvent>) {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  prepararEdicao(idEvent: number) {
    // console.log(`Preparando edição do sensor com ID: ${id}`);
    this.router.navigate(['/paginas/create-event'], { queryParams: { id: idEvent } });
  }

  ativaDesativa(idEvent: number) {
    this.service.ativaDesativa(idEvent).subscribe(next => {
      this.toast.success('Sensor ativado/desativado com sucesso!', 'Sucesso'),
        this.ListEvents();
    });
  }
}

