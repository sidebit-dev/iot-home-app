export type StatusSensor = 'NORMAL' | 'ALARME' ;

export class DadosSensorForm {
    nome!: string
    descricao!: string;
    status!: StatusSensor;
    ativo!: boolean;
    ticket_id!: number;
}

export class DadosSensor {
    id!: number;
    nome!: string;
    descricao!: string;
    status!: StatusSensor;
    ativo!: boolean;
    ticket_id!: number;
    dataCadastro!: Date;
}

export class FiltroSensor{
    status?: StatusSensor;
    ticket_id?: number;
    page?: number;
    size?: number;
}