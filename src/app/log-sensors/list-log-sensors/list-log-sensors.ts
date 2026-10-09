import { Component, OnInit, inject } from '@angular/core';
import { LogSensorService } from '../log-sensor-service';
import { Observable } from 'rxjs';
import { DadosLogSensor } from '../dados-log-sensor';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';

@Component({
  selector: 'app-list-log-sensors',
  imports: [CommonModule, RouterLink,Header],
  templateUrl: './list-log-sensors.html',
  styleUrl: './list-log-sensors.scss',
})
export class ListLogSensors implements OnInit {
    service = inject(LogSensorService);
    router = inject(Router);
    toast = inject(ToastrService);
    listagem$!: Observable<PageResult<DadosLogSensor>>;
    paginaAtual = 0;
    tamanhoPagina = 5;
  
    ngOnInit(): void {
      this.listarLogSensors();
    }

    listarLogSensors() {
    this.listagem$ = this.service.findAll(this.paginaAtual, this.tamanhoPagina);
  }

  navegar(pagina: number) {
      this.paginaAtual = pagina;
      this.listarLogSensors();
    }
  
    navegarProximo(listagem: PageResult<DadosLogSensor>) {
      if (!listagem.last) {
        this.navegar(listagem.number + 1);
      }
    }
  
    navegarAnterior(listagem: PageResult<DadosLogSensor>) {
      if (!listagem.first) {
        this.navegar(listagem.number - 1);
      }
    }

    paginas(totalPages: number): number[] {
        return Array.from({ length: totalPages }, (valor, i) => i);
      }
    
      registroInicial(listagem: PageResult<DadosLogSensor>) {
        if (listagem.totalElements === 0) {
          return 0;
        }
    
        return listagem.number * listagem.size + 1;
      }

      registroFinal(listagem: PageResult<DadosLogSensor>) {
          if (listagem.totalElements === 0) {
            return 0;
          }
          return Math.min((listagem.number + 1) * listagem.size, listagem.totalElements);
        }
      
        prepararEdicao(idLogSensor: number) {
          // console.log(`Preparando edição do sensor com ID: ${id}`);
          this.router.navigate(['/paginas/create-log-sensor'], { queryParams: { id: idLogSensor } });
        }

        ativaDesativa(idLogSensor: number) {
    this.service.ativaDesativa(idLogSensor).subscribe(next => {
      this.toast.success('Sensor ativado/desativado com sucesso!', 'Sucesso'),
      this.listarLogSensors();
    });
  }
}

