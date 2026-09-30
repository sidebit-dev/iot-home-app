import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../ticket-service';
import { DadosTicket, DadosTicketForm } from '../dados-ticket';

interface CreateTicketForm{
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
      nome: new FormControl('', {nonNullable: true, validators: Validators.required}),
      descricao: new FormControl('', {nonNullable: true, validators: Validators.required}),
      endereco: new FormControl('', {nonNullable: true, validators: Validators.required}),
      status: new FormControl('', {nonNullable: true, validators: Validators.required}),
      ativo: new FormControl(true, {nonNullable: true, validators: Validators.required}),
    });
  }

  handleSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      const dadosTicket = this.form.value as DadosTicketForm;
      this.service.createTicket(dadosTicket).subscribe({
        next: (response: DadosTicket) => {console.log('Ticket criado com sucesso:', response);},
        error: (error) => {console.error('Erro ao criar ticket:', error);}
      });
    } else {
      console.log('Formulário inválido');
    }
}
}