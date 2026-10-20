import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../events-service';
import { DadosEvent, DadosEventForm } from '../dados-events';
import { ValidationErrorResponse } from '../../common/validation/validation-error-model';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Header } from '../../common/components/header/header';

interface CreateEventForm {
  status: FormControl<string>;
  description: FormControl<string>;
  sensor_id: FormControl<string>;
}

@Component({
  selector: 'app-create-log-sensor',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    Header],
  templateUrl: './create-event.html',
  styleUrl: './create-event.scss',
})
export class CreateEvent implements OnInit {
  form!: FormGroup<CreateEventForm>;
  rotaAtiva = inject(ActivatedRoute);
  service = inject(EventService);
  toast = inject(ToastrService);
  idEventParaEdicao?: number;

  ngOnInit(): void {
    this.form = new FormGroup<CreateEventForm>({
      status: new FormControl('', { nonNullable: true, validators: Validators.required }),
      description: new FormControl('', { nonNullable: true, validators: Validators.required }),
      sensor_id: new FormControl('', { nonNullable: true, validators: Validators.required })
    });

    this.carregarLogSensorParaEdicao();
  }

  carregarLogSensorParaEdicao() {
    this.idEventParaEdicao = Number(this.rotaAtiva.snapshot.queryParamMap.get('id'));

    if (!this.idEventParaEdicao) {
      return;
    }

    this.service
      .findById(this.idEventParaEdicao)
      .subscribe({
        next: (event) => {
          this.form.patchValue({
            status: event.status,
            description: event.description,
            sensor_id: event.sensor_id,

          })
        },
        error: () => { this.toast.error('Ocorreu um erro ao carregar o log do sensor para edição.') }
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

    const dadosLogSensor = this.form.value as DadosEventForm;

    const requisicao: Observable<DadosEvent | void> = this.idEventParaEdicao ?
      this.service.update(this.idEventParaEdicao, dadosLogSensor) :
      this.service.create(dadosLogSensor);


    requisicao.subscribe({
      next: (response) => {
        // console.log('Log Sensor criado com sucesso:', response);
        this.toast.success('Sensor cadastrado/atualizado com sucesso!', 'Sucesso');
        this.form.reset();
        this.idEventParaEdicao = undefined;
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
    this.toast.error('Ocorreu um erro ao criar o log do sensor. Por favor, tente novamente mais tarde.', 'Erro');
    console.error('Erro ao criar o Event do sensor:', response.error);
  }
}

