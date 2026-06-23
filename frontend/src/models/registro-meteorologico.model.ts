import { Local } from './local.model';

export interface RegistroMeteorologico {
  _id?: string;
  local: string | Local;
  dataHora?: string;
  temperatura: number;
  umidade: number;
  velocidadeVento?: number;
  precipitacao?: number;
  createdAt?: string;
  updatedAt?: string;
}
