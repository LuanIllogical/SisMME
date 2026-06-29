import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Local } from '../../models/local.model';
import { RegistroMeteorologico } from '../../models/registro-meteorologico.model';
import { LocalService } from '../../../services/local.service';
import { RegistroService } from '../../../services/registro.service';

// Interface para o payload com propriedades opcionais
interface RegistroPayload {
  local: string;
  dataHora: string;
  temperatura: number;
  umidade: number;
  velocidadeVento?: number;
  precipitacao?: number;
}

@Component({
  standalone: false,
  selector: 'app-novo-registro',
  templateUrl: './novo-registro.component.html',
  styleUrls: ['./novo-registro.component.css']
})
export class NovoRegistroComponent implements OnInit {
  locais: Local[] = [];
  registro: any = {
    local: '',
    dataHora: '',
    temperatura: null,
    umidade: null,
    velocidadeVento: null,
    precipitacao: null
  };
  salvando = false;
  erro = '';
  erroDetalhe = '';

  constructor(
    private localService: LocalService,
    private registroService: RegistroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLocais();
    this.definirDataHoraAtual();
  }

  carregarLocais(): void {
    this.localService.listar(true).subscribe({
      next: (locais) => {
        console.log('✅ Locais carregados:', locais);
        this.locais = locais;
        
        if (locais.length === 1) {
          this.registro.local = locais[0]._id;
        }
      },
      error: (err) => {
        console.error('❌ Erro ao carregar locais:', err);
        this.erro = 'Não foi possível carregar os locais.';
        this.erroDetalhe = err.message || 'Erro desconhecido';
      }
    });
  }

  definirDataHoraAtual(): void {
    const agora = new Date();
    agora.setSeconds(0, 0);
    this.registro.dataHora = agora.toISOString().slice(0, 16);
  }

  salvar(form: NgForm): void {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.erro = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (!this.registro.local || this.registro.local === '') {
      this.erro = 'Por favor, selecione um local.';
      return;
    }

    // Criar payload com tipagem correta
    const payload: RegistroPayload = {
      local: this.registro.local,
      dataHora: this.registro.dataHora,
      temperatura: Number(this.registro.temperatura),
      umidade: Number(this.registro.umidade)
    };

    // Adicionar campos opcionais com verificação
    if (this.registro.velocidadeVento !== null && 
        this.registro.velocidadeVento !== '' && 
        this.registro.velocidadeVento !== undefined) {
      payload.velocidadeVento = Number(this.registro.velocidadeVento);
    }

    if (this.registro.precipitacao !== null && 
        this.registro.precipitacao !== '' && 
        this.registro.precipitacao !== undefined) {
      payload.precipitacao = Number(this.registro.precipitacao);
    }

    console.log('📤 Payload sendo enviado:', JSON.stringify(payload, null, 2));

    this.salvando = true;
    this.erro = '';
    this.erroDetalhe = '';

    this.registroService.criar(payload).subscribe({
      next: (response) => {
        console.log('✅ Registro criado com sucesso:', response);
        this.salvando = false;
        this.router.navigate(['/registros'], {
          state: { mensagem: 'Registro meteorológico salvo com sucesso!' }
        });
      },
      error: (err) => {
        console.error('❌ Erro ao salvar registro:', err);
        
        let mensagemErro = 'Erro ao salvar o registro.';
        let detalheErro = '';
        
        if (err.error) {
          if (err.error.message) {
            mensagemErro = err.error.message;
          }
          if (err.error.erros) {
            detalheErro = err.error.erros.join(', ');
          }
          if (err.error.campos) {
            detalheErro = `Campos faltando: ${err.error.campos.join(', ')}`;
          }
        } else if (err.message) {
          detalheErro = err.message;
        }
        
        this.erro = mensagemErro;
        this.erroDetalhe = detalheErro;
        this.salvando = false;
      }
    });
  }

  limpar(form: NgForm): void {
    form.resetForm();
    this.registro = {
      local: '',
      dataHora: '',
      temperatura: null,
      umidade: null,
      velocidadeVento: null,
      precipitacao: null
    };
    this.definirDataHoraAtual();
    this.erro = '';
    this.erroDetalhe = '';
    
    if (this.locais.length === 1) {
      this.registro.local = this.locais[0]._id;
    }
  }
}