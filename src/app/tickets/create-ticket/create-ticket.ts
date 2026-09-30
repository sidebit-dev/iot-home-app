import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../ticket-service';
import { DadosTicket, DadosTicketForm } from '../dados-ticket';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';

interface CreateTicketForm {
  nome: FormControl<string>;
  descricao: FormControl<string>;
  endereco: FormControl<string>;
  status: FormControl<string>;
  ativo: FormControl<boolean | null>;
}

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss',
})
export class CreateTicket implements OnInit {
  form!: FormGroup<CreateTicketForm>;
  service = inject(TicketService);

  ngOnInit(): void {
    this.form = new FormGroup<CreateTicketForm>({
      nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
      descricao: new FormControl('', { nonNullable: true, validators: Validators.required }),
      endereco: new FormControl('', { nonNullable: true, validators: Validators.required }),
      status: new FormControl('', { nonNullable: true, validators: Validators.required }),
      ativo: new FormControl(true, { nonNullable: true, validators: Validators.required }),
    });
  }

  handleSubmit(): void {
    console.log(this.form.value);
    const dadosTicket = this.form.value as DadosTicketForm;
    this.service.createTicket(dadosTicket).subscribe({
      next: (response: DadosTicket) => { console.log('Ticket criado com sucesso:', response); },
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
      return;
    }
  }
}