export interface ValidationErrorResponse {
  timestamp: Date;
  status: number;
  message: string;
  camposInvalidos: CampoInvalido[];
}

export interface CampoInvalido {
  campo: string;
  erro: string;
}