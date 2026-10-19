export class ResumoStatus {
  sensoresTotais!: number;
  sensoresAtuados!: number;
  sensoresNormais!: number;

  constructor(sensoresTotais: number, sensoresAtuados: number, sensoresNormais: number) {
    this.sensoresTotais = sensoresTotais;
    this.sensoresAtuados = sensoresAtuados;
    this.sensoresNormais = sensoresNormais;
  }
}

  export class AtuadosTicketResumo {
    ticket!: string;
  }

  export class Dashboard {
    mes!: string;
    resumo!: ResumoStatus;
    atuadosPorTickets!: AtuadosTicketResumo[];
  }