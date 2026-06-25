import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Local } from '../../models/local.model';
import { RegistroMeteorologico } from '../../models/registro-meteorologico.model';
import { LocalService } from '../../services/local.service';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  registros: RegistroMeteorologico[] = [];
  locais: Local[] = [];
  carregando = true;
  erro = '';

  metricas = {
    tempMedia: 0, tempMin: 0, tempMax: 0,
    umidadeMedia: 0,
    precipTotal: 0, eventosPrec: 0,
    locaisAtivos: 0, totalLocais: 0
  };

  constructor(
    private localService: LocalService,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    forkJoin({
      locais: this.localService.listar(),
      registros: this.registroService.listar()
    }).subscribe({
      next: ({ locais, registros }) => {
        this.locais = locais;
        this.registros = registros;
        this.calcularMetricas();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os dados. Verifique se o servidor está em execução.';
        this.carregando = false;
      }
    });
  }

  private calcularMetricas(): void {
    const regs = this.registros;
    const n = regs.length;

    if (n === 0) return;

    const temps = regs.map(r => r.temperatura);
    const umids = regs.map(r => r.umidade);
    const precs = regs.filter(r => (r.precipitacao ?? 0) > 0);

    this.metricas = {
      tempMedia: +( temps.reduce((a, b) => a + b, 0) / n ).toFixed(1),
      tempMin:   +Math.min(...temps).toFixed(1),
      tempMax:   +Math.max(...temps).toFixed(1),
      umidadeMedia: +( umids.reduce((a, b) => a + b, 0) / n ).toFixed(0),
      precipTotal:  +( precs.reduce((s, r) => s + (r.precipitacao ?? 0), 0) ).toFixed(1),
      eventosPrec:  precs.length,
      locaisAtivos: this.locais.filter(l => l.ativo).length,
      totalLocais:  this.locais.length
    };
  }

  get registrosRecentes(): RegistroMeteorologico[] {
    return [...this.registros]
      .sort((a, b) => (b.dataHora ?? '').localeCompare(a.dataHora ?? ''))
      .slice(0, 5);
  }

  nomeLocal(localRef: string | Local | undefined): string {
    if (!localRef) return '—';
    if (typeof localRef === 'object') return localRef.nome;
    const local = this.locais.find(l => l._id === localRef);
    return local?.nome ?? localRef;
  }

  classeTemp(temp: number): string {
    if (temp < 18) return 'temp-cold';
    if (temp > 28) return 'temp-hot';
    return 'temp-normal';
  }

  calcBarHeight(temp: number): number {
    const temps = this.registros.map(r => r.temperatura);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    return Math.round(((temp - min) / range) * 50 + 10);
  }
}
