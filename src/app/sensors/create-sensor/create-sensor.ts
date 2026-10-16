import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SensorService } from '../sensor-service';
import { DadosSensor, DadosSensorForm, StatusSensor } from '../dados-sensor';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Header } from '../../common/components/header/header';
import { DadosTicket } from '../../tickets/dados-ticket';

interface CreateSensorForm {
  nome: FormControl<string>;
  descricao: FormControl<string>;
  status: FormControl<StatusSensor |''>;
  // ativo: FormControl<boolean | null>;
  ticket_id: FormControl<number>;
}

@Component({
  selector: 'app-create-sensor',
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    RouterModule,
    Header],
  templateUrl: './create-sensor.html',
  styleUrl: './create-sensor.scss',
})
export class CreateSensor implements OnInit {
  form!: FormGroup<CreateSensorForm>;
  rotaAtiva = inject(ActivatedRoute);
  service = inject(SensorService);
  toast = inject(ToastrService);
  idSensorParaEdicao?: number;

  ticketsDisponiveis: DadosTicket[] = [];

  ngOnInit(): void {
    this.form = new FormGroup<CreateSensorForm>({
      ticket_id: new FormControl<number>(0, { nonNullable: true, validators: Validators.required }),
      nome: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      descricao: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      status: new FormControl<StatusSensor | ''>('', { nonNullable: true, validators: Validators.required }),
      // ativo: new FormControl(true, { nonNullable: true, validators: Validators.required }),
    });
    
    this.inicializarDropDowns();
    this.carregarSensorParaEdicao();
  }

  // EM VEZ DISSO VAMOS FAZER CHAMADAS ENCADEADAS PARA PEGAR OS TICKETS DISPONIVEIS PARA O SENSOR, POIS O USUARIO PODE TER CRIADO UM TICKET E NAO TER FEITO O REFRESH DA PAGINA
  // inicializarTicketsDisponiveis() {
  //   this.service.listarTicketsDisponiveis().subscribe({
  //     next: (tickets) => {
  //       this.ticketsDisponiveis = tickets;
  //     },
  //     error: () => {
  //       this.toast.error('Ocorreu um erro ao carregar os tickets disponíveis.', 'Erro');
  //     }
  //   });
  // }
  inicializarDropDowns(){
    forkJoin({
      tickets: this.service.listarTicketsDisponiveis()
    }).subscribe({
      next: ({ tickets }) => {
        this.ticketsDisponiveis = tickets;
      },
      error: () => {
        this.toast.error('Ocorreu um erro ao carregar os dados para o formulário.', 'Erro');
      }
    }); 
  }

  carregarSensorParaEdicao() {
    this.idSensorParaEdicao = Number(this.rotaAtiva.snapshot.queryParamMap.get('id'));

    if (!this.idSensorParaEdicao) {
      return;
    }

    this.service
      .findById(this.idSensorParaEdicao)
      .subscribe({
        next: (sensor) => {
          this.form.patchValue({
            nome: sensor.nome,
            descricao: sensor.descricao,
            status: sensor.status,
            // ativo: sensor.ativo,
          })
        },
        error: () => { this.toast.error('Ocorreu um erro ao carregar o sensor para edição.') }
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
    //  console.log('Formulário enviado:', this.form.value);

    const dadosSensor = this.form.value as DadosSensorForm;

    const requisicao: Observable<DadosSensor | void> = this.idSensorParaEdicao ?
      this.service.updateSensor(this.idSensorParaEdicao, dadosSensor) :
      this.service.createSensor(dadosSensor);


    requisicao.subscribe({
      next: (response) => {
        // console.log('Sensor criado com sucesso:', response);
        this.toast.success('Sensor cadastrado/atualizado com sucesso!', 'Sucesso');
        this.form.reset();
        this.idSensorParaEdicao = undefined;
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
    this.toast.error('Ocorreu um erro ao criar o sensor. Por favor, tente novamente mais tarde.', 'Erro');
    console.error('Erro ao criar o sensor:', response.error);
  }
}
