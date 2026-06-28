import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Local } from '../../models/local.model';
import { LocalService } from '../../services/local.service';

@Component({
  standalone: false,
  selector: 'app-novo-local',
  templateUrl: './novo-local.component.html',
  styleUrls: ['./novo-local.component.css']
})
export class NovoLocalComponent {
  local: Partial<Local> = { ativo: true };
  salvando = false;
  erro = '';

  constructor(
    private localService: LocalService,
    private router: Router
  ) {}

  salvar(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    this.localService.criar(this.local as Local).subscribe({
      next: () => {
        this.router.navigate(['/locais'], {
          state: { mensagem: `Local "${this.local.nome}" cadastrado com sucesso.` }
        });
      },
      error: () => {
        this.erro = 'Erro ao cadastrar o local. Verifique os dados e tente novamente.';
        this.salvando = false;
      }
    });
  }

  limpar(form: NgForm): void {
    form.resetForm();
    this.local = { ativo: true };
    this.erro = '';
  }
}
