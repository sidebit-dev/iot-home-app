import { Component, OnInit, inject } from '@angular/core';
import { SensorService } from '../sensor-service';
import { Observable } from 'rxjs';
import { DadosSensor, StatusSensor } from '../dados-sensor';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DadosTicket } from '../../tickets/dados-ticket';

interface FiltrosForm {
  status: FormControl<StatusSensor | ''>;
  ticket_id: FormControl<number | ''>;
}

@Component({
  selector: 'app-listagem-sensors',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Header],
  templateUrl: './listagem-sensors.html',
  styleUrl: './listagem-sensors.scss',
})

export class ListagemSensors implements OnInit {
  service = inject(SensorService);
  router = inject(Router);
  toast = inject(ToastrService);
  listagem$!: Observable<PageResult<DadosSensor>>;
  tickets: DadosTicket[] = [];
  paginaAtual = 0;
  tamanhoPagina = 10;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = new FormGroup<FiltrosForm>({
      status: new FormControl<StatusSensor | ''>('', { nonNullable: true }),
      ticket_id: new FormControl<number | ''>('', { nonNullable: true }),
    });

    this.listarTicketsFiltro();
    this.listarSensors();   

  }

  listarSensors() {
    const status = this.form.get('status')?.value;
    const ticket_id = this.form.get('ticket_id')?.value;

    this.listagem$ = this.service.listar({
      page: this.paginaAtual,
      size: this.tamanhoPagina,
      status: status || undefined,
      ticket_id: ticket_id || undefined
    });
  }

  aplicarFiltros() {
    console.log('Filtros aplicados:', this.form.value);
    this.paginaAtual = 0; // Resetar para a primeira página ao aplicar filtros
    this.listarSensors();
  }

  limparFiltros() {
    this.form.reset();
    // this.paginaAtual = 0; // Resetar para a primeira página ao limpar filtros
    // this.listarSensors();
  }

  listarTicketsFiltro() {
    this.service.listarTicketsParaFiltrar().subscribe({
      next: (resultado: DadosTicket[]) => {
        this.tickets = resultado;
      },
      error: () => this.toast.error('Erro ao carregar tickets para filtro', 'Erro')
    });
  }

  deletar(id: number): void {
    // Implementar a lógica de exclusão do sensor aqui
    console.log(`Deletando sensor com ID: ${id}`);
  }

  navegar(pagina: number): void {
    this.paginaAtual = pagina;
    this.listarSensors();
  }

  navegarProximo(listagem: PageResult<DadosSensor>): void {
    if (!listagem.last) {
      this.navegar(listagem.number + 1);
    }
  }

  navegarAnterior(listagem: PageResult<DadosSensor>) {
    if (!listagem.first) {
      this.navegar(listagem.number - 1);
    }
  }

  paginas(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_valor, i) => i);
  }

  registroInicial(listagem: PageResult<DadosSensor>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }

    return listagem.number * listagem.size + 1;
  }

  registroFinal(listagem: PageResult<DadosSensor>): number {
    if (listagem.totalElements === 0) {
      return 0;
    }
    return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
  }

  prepararEdicao(idSensor: number) {
    // console.log(`Preparando edição do sensor com ID: ${id}`);
    this.router.navigate(['/paginas/create-sensor'], { queryParams: { id: idSensor } });
  }

  ativaDesativa(idSensor: number) {
    this.service.ativaDesativa(idSensor).subscribe(next => {
      this.toast.success('Sensor ativado/desativado com sucesso!', 'Sucesso'),
        this.listarSensors();
    });
  }
}
