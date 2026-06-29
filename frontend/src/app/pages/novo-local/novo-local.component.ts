import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Local } from '../../models/local.model';
import { LocalService } from '../../../services/local.service';

@Component({
  standalone: false,
  selector: 'app-novo-local',
  templateUrl: './novo-local.component.html',
  styleUrls: ['./novo-local.component.css']
})
export class NovoLocalComponent implements OnInit {
  local: Partial<Local> = { ativo: true };
  salvando = false;
  erro = '';
  erroDetalhe = '';

  constructor(
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  salvar(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    // Cast explícito: inputs HTML sempre retornam string, Mongoose exige Number
    const payload: Local = {
      nome:      String(this.local.nome ?? '').trim(),
      descricao: this.local.descricao ? String(this.local.descricao).trim() : undefined,
      latitude:  Number(this.local.latitude),
      longitude: Number(this.local.longitude),
      ativo:     true
    };

    if (isNaN(payload.latitude) || isNaN(payload.longitude)) {
      this.erro = 'Latitude e longitude precisam ser números válidos.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.erroDetalhe = '';

    this.localService.criar(payload).subscribe({
      next: () => {
        this.router.navigate(['/locais'], {
          state: { mensagem: `Local "${payload.nome}" cadastrado com sucesso.` }
        });
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.message ?? '';
        this.erro = 'Erro ao cadastrar o local.';
        this.erroDetalhe = msg;
        this.salvando = false;
      }
    });
  }

  limpar(form: NgForm): void {
    form.resetForm();
    this.local = { ativo: true };
    this.erro = '';
    this.erroDetalhe = '';
  }
}
