import { Component, OnInit } from '@angular/core';
import { Local } from '../../models/local.model';
import { LocalService } from '../../services/local.service';

@Component({
  standalone: false,
  selector: 'app-locais',
  templateUrl: './locais.component.html',
  styleUrls: ['./locais.component.css']
})
export class LocaisComponent implements OnInit {
  locais: Local[] = [];
  carregando = true;
  mensagem = '';
  erro = '';

  busca = '';
  filtroAtivo: 'todos' | 'ativos' | 'inativos' = 'todos';

  constructor(private localService: LocalService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.localService.listar().subscribe({
      next: locais => { this.locais = locais; this.carregando = false; },
      error: () => { this.erro = 'Não foi possível carregar os locais.'; this.carregando = false; }
    });
  }

  get locaisFiltrados(): Local[] {
    return this.locais.filter(l => {
      const texto = (l.nome + ' ' + (l.descricao ?? '')).toLowerCase();
      const passaBusca = !this.busca || texto.includes(this.busca.toLowerCase());
      const passaFiltro =
        this.filtroAtivo === 'todos' ? true :
        this.filtroAtivo === 'ativos' ? l.ativo === true :
        l.ativo === false;
      return passaBusca && passaFiltro;
    });
  }

  alterarStatus(local: Local): void {
    if (!local._id) return;
    const novoStatus = !local.ativo;

    this.localService.alterarStatus(local._id, novoStatus).subscribe({
      next: localAtualizado => {
        const idx = this.locais.findIndex(l => l._id === local._id);
        if (idx !== -1) this.locais[idx] = localAtualizado;
        this.mensagem = `Local "${local.nome}" ${novoStatus ? 'ativado' : 'desativado'} com sucesso.`;
        setTimeout(() => this.mensagem = '', 4000);
      },
      error: () => {
        this.erro = 'Erro ao alterar status do local.';
        setTimeout(() => this.erro = '', 4000);
      }
    });
  }
}
