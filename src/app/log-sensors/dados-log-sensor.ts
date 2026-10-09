export class DadosLogSensorForm {
    status!: string;
    description!: string;
    sensor_id!: string;
}

export class DadosLogSensor {
    id!: number;
    status!: string;
    description!: string;
    dataEvento!: Date;
    sensor_id!: string;

}