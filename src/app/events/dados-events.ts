export class DadosEventForm {
    status!: string;
    description!: string;
    sensor_id!: string;
}

export class DadosEvent {
    id!: number;
    status!: string;
    description!: string;
    dataEvento!: Date;
    sensor_id!: string;

}