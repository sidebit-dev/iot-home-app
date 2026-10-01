import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../ticket-service';
import { DadosTicket, DadosTicketForm } from '../dados-ticket';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

interface CreateTicketForm {
  nome: FormControl<string>;
  descricao: FormControl<string>;
  endereco: FormControl<string>;
  status: FormControl<string>;
  ativo: FormControl<boolean | null>;
}

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss',
})
export class CreateTicket implements OnInit {
  form!: FormGroup<CreateTicketForm>;
  rotaAtiva = inject(ActivatedRoute);
  service = inject(TicketService);
  toast = inject(ToastrService);
  idTicketParaEdicao?: number;

  ngOnInit(): void {
    this.form = new FormGroup<CreateTicketForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      descricao: new FormControl('', { nonNullable: true, validators: Validators.required }),
      endereco: new FormControl('', { nonNullable: true, validators: Validators.required }),
      status: new FormControl('', { nonNullable: true, validators: Validators.required }),
      ativo: new FormControl(true, { nonNullable: true, validators: Validators.required }),
    });

    this.carregarTicketParaEdicao();
  }

  carregarTicketParaEdicao() {
    this.idTicketParaEdicao = Number(this.rotaAtiva.snapshot.queryParamMap.get('id'));

    if (!this.idTicketParaEdicao) {
      return;
    }

    this.service
      .findById(this.idTicketParaEdicao)
      .subscribe({
        next: (ticket) => {
          this.form.patchValue({
            nome: ticket.nome,
            descricao: ticket.descricao,
            endereco: ticket.endereco,
            status: ticket.status,
            ativo: ticket.ativo,
          })
        },
        error: () => { this.toast.error('Ocorreu um erro ao carregar o ticket para edição.') }
      })
  }

  isFormInvalid(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Existem campos inválidos no formulário.', 'Erro de Validação');
      return true;
    }
    return false;

  }

  handleSubmit(): void {
    if (this.isFormInvalid()) {
      return;
    }

    const dadosTicket = this.form.value as DadosTicketForm;

    const requisicao: Observable<DadosTicket | void> = this.idTicketParaEdicao ?
      this.service.updateTicket(this.idTicketParaEdicao, dadosTicket) :
      this.service.createTicket(dadosTicket);


    requisicao.subscribe({
      next: (response) => {
        // console.log('Ticket criado com sucesso:', response);
        this.toast.success('Ticket cadastrado/atualizado com sucesso!', 'Sucesso');
        this.form.reset();
        this.idTicketParaEdicao = undefined;
      },
      error: (error) => this.onApiError(error)
    });
  }

  private aplicarErrosValidacao(error: ValidationErrorResponse) {
    error.camposInvalidos.forEach(ci => {
      const control = this.form.get(ci.campo);
      if (control) {
        control.setErrors({ apiError: ci.erro });
        control.markAsTouched();
      }
    })
  }

  private onApiError(response: any): void {
    if (response.status === 422) {
      this.aplicarErrosValidacao(response.error);
      this.toast.error('Existem campos inválidos no formulário.', 'Erro de Validação');
      return;
    }
    this.toast.error('Ocorreu um erro ao criar o ticket. Por favor, tente novamente mais tarde.', 'Erro');
    console.error('Erro ao criar o ticket:', response.error);
  }
}