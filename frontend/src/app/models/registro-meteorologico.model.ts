export interface RegistroMeteorologico {
  _id?: string;
  localId: string;
  dataHora: string;
  temperatura: number;
  umidade: number;
  velocidadeVento: number;
  direcaoVento: number;
  radiacaoSolar: number;
  precipitacao: number;
}