import { Component, OnInit, inject } from '@angular/core';
import { SensorService } from '../sensor-service';
import { Observable } from 'rxjs';
import { DadosSensor } from '../dados-sensor';
import { PageResult } from '../../common/pagination/page-result';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../common/components/header/header';

@Component({
  selector: 'app-listagem-sensors',
  imports: [CommonModule, RouterLink,Header],
  templateUrl: './listagem-sensors.html',
  styleUrl: './listagem-sensors.scss',
})
export class ListagemSensors implements OnInit {
    service = inject(SensorService);
    router = inject(Router);
    toast = inject(ToastrService);
    listagem$!: Observable<PageResult<DadosSensor>>;
    paginaAtual = 0;
    tamanhoPagina = 5;
  
    ngOnInit(): void {
      this.listarSensors();
    }

    listarSensors() {
    this.listagem$ = this.service.findAll(this.paginaAtual, this.tamanhoPagina);
  }

  navegar(pagina: number) {
      this.paginaAtual = pagina;
      this.listarSensors();
    }
  
    navegarProximo(listagem: PageResult<DadosSensor>) {
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
        return Array.from({ length: totalPages }, (valor, i) => i);
      }
    
      registroInicial(listagem: PageResult<DadosSensor>) {
        if (listagem.totalElements === 0) {
          return 0;
        }
    
        return listagem.number * listagem.size + 1;
      }

      registroFinal(listagem: PageResult<DadosSensor>) {
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
