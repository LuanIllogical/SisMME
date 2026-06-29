import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Local } from '../../models/local.model';
import { RegistroMeteorologico } from '../../models/registro-meteorologico.model';
import { LocalService } from '../../../services/local.service';
import { FiltrosRegistro, RegistroService } from '../../../services/registro.service';

@Component({
  standalone: false,
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {
  registros: RegistroMeteorologico[] = [];
  locais: Local[] = [];
  carregando = true;
  mensagem = '';
  erro = '';

  filtros: FiltrosRegistro = { localId: '' };

  constructor(
    private registroService: RegistroService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Captura mensagem via history.state (compatível com navegação Angular)
    const state = history.state as { mensagem?: string };
    if (state?.mensagem) {
      this.mensagem = state.mensagem;
      setTimeout(() => this.mensagem = '', 4000);
    }

    this.localService.listar().subscribe({
      next: locais => this.locais = locais,
      error: () => {}
    });

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.carregando = true;
    this.registroService.listar(this.filtros).subscribe({
      next: registros => {
        this.registros = [...registros].sort(
          (a, b) => (b.dataHora ?? '').localeCompare(a.dataHora ?? '')
        );
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os registros.';
        this.carregando = false;
      }
    });
  }

  limparFiltros(): void {
    this.filtros = {};
    this.aplicarFiltros();
  }

  get temFiltroAtivo(): boolean {
    return !!(
      this.filtros.localId ||
      this.filtros.dataInicio ||
      this.filtros.dataFim ||
      this.filtros.tempMin != null ||
      this.filtros.tempMax != null
    );
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

  excluir(registro: RegistroMeteorologico): void {
    if (!registro._id) return;
    if (!confirm('Deseja excluir este registro? Esta ação não pode ser desfeita.')) return;

    this.registroService.excluir(registro._id).subscribe({
      next: () => {
        this.registros = this.registros.filter(r => r._id !== registro._id);
        this.mensagem = 'Registro excluído com sucesso.';
        setTimeout(() => this.mensagem = '', 4000);
      },
      error: () => {
        this.erro = 'Erro ao excluir o registro.';
        setTimeout(() => this.erro = '', 4000);
      }
    });
  }
}
