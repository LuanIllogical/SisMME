import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Local } from '../../models/local.model';
import { RegistroMeteorologico } from '../../models/registro-meteorologico.model';
import { LocalService } from '../../../services/local.service';
import { RegistroService } from '../../../services/registro.service';

@Component({
  standalone: false,
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

  private locaisCarregados = false;
  private registrosCarregados = false;

  constructor(
    private localService: LocalService,
    private registroService: RegistroService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.locaisCarregados = false;
    this.registrosCarregados = false;

    this.localService.listar().subscribe({
      next: locais => {
        this.locais = locais;
        this.locaisCarregados = true;
        this.tentarFinalizar();
      },
      error: () => {
        this.locais = [];
        this.locaisCarregados = true;
        this.tentarFinalizar();
      }
    });

    this.registroService.listar().subscribe({
      next: registros => {
        this.registros = registros;
        this.registrosCarregados = true;
        this.tentarFinalizar();
      },
      error: () => {
        this.registros = [];
        this.registrosCarregados = true;
        this.tentarFinalizar();
      }
    });
  }

  private tentarFinalizar(): void {
    if (!this.locaisCarregados || !this.registrosCarregados) return;
    this.calcularMetricas();
    this.carregando = false;
    this.cdr.detectChanges();
  }

  private calcularMetricas(): void {
    const regs = this.registros;
    const n = regs.length;

    if (n === 0) {
      this.metricas = {
        tempMedia: 0, tempMin: 0, tempMax: 0, umidadeMedia: 0,
        precipTotal: 0, eventosPrec: 0,
        locaisAtivos: this.locais.filter(l => l.ativo).length,
        totalLocais: this.locais.length
      };
      return;
    }

    const temps = regs.map(r => r.temperatura);
    const umids = regs.map(r => r.umidade);
    const precs = regs.filter(r => (r.precipitacao ?? 0) > 0);

    this.metricas = {
      tempMedia:    +( temps.reduce((a, b) => a + b, 0) / n ).toFixed(1),
      tempMin:      +Math.min(...temps).toFixed(1),
      tempMax:      +Math.max(...temps).toFixed(1),
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
    return this.locais.find(l => l._id === localRef)?.nome ?? localRef;
  }

  classeTemp(temp: number): string {
    if (temp < 18) return 'temp-cold';
    if (temp > 28) return 'temp-hot';
    return 'temp-normal';
  }

  calcBarHeight(temp: number): number {
    const temps = this.registros.map(r => r.temperatura);
    if (temps.length === 0) return 10;
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    return Math.round(((temp - min) / range) * 50 + 10);
  }
}