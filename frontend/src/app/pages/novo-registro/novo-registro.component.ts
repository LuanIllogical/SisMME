import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Local } from '../../models/local.model';
import { RegistroMeteorologico } from '../../models/registro-meteorologico.model';
import { LocalService } from '../../services/local.service';
import { RegistroService } from '../../services/registro.service';

@Component({
  standalone: false,
  selector: 'app-novo-registro',
  templateUrl: './novo-registro.component.html',
  styleUrls: ['./novo-registro.component.css']
})
export class NovoRegistroComponent implements OnInit {
  locais: Local[] = [];
  registro: Partial<RegistroMeteorologico> = {};
  salvando = false;
  erro = '';

  constructor(
    private localService: LocalService,
    private registroService: RegistroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.localService.listar(true).subscribe({
      next: locais => this.locais = locais,
      error: () => this.erro = 'Não foi possível carregar os locais.'
    });

    // Preenche data/hora atual como padrão
    const agora = new Date();
    agora.setSeconds(0, 0);
    this.registro.dataHora = agora.toISOString().slice(0, 16);
  }

  salvar(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    this.registroService.criar(this.registro as RegistroMeteorologico).subscribe({
      next: () => {
        this.router.navigate(['/registros'], {
          state: { mensagem: 'Registro meteorológico salvo com sucesso.' }
        });
      },
      error: () => {
        this.erro = 'Erro ao salvar o registro. Verifique os dados e tente novamente.';
        this.salvando = false;
      }
    });
  }

  limpar(form: NgForm): void {
    form.resetForm();
    const agora = new Date();
    agora.setSeconds(0, 0);
    this.registro = { dataHora: agora.toISOString().slice(0, 16) };
    this.erro = '';
  }
}
