import { Component, signal, OnInit, inject, OnDestroy, computed, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtivoService, Ativo } from './services/ativo';
//import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // Necessário para usar *ngFor e Pipes de data
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private services = inject(AtivoService);
  public listaAtivos = signal<Ativo[]>([]);
  private intervalId: any;

  // Signal para controle manual do "X"
  public exibirAlertaManual = signal(true);

  private quantidadeCriticosAnterior = 0;

  // Signal Computado: Sempre que listaAtivos mudar, ele filtra os críticos (> 90%)
  public ativosCriticos = computed(() => 
    this.listaAtivos().filter(a => a.carga_cpu >= 90)
  );

  // Signal final que decide se mostra ou não (Lógica + Controle Manual)
  public mostrarNotificacao = computed(() => 
    this.ativosCriticos().length > 0 && this.exibirAlertaManual()
  );

  constructor() {
    effect(() => {
      const quantidadeAtual = this.ativosCriticos().length;

      // SÓ reseta o alerta se a quantidade de servidores críticos AUMENTAR
      if (quantidadeAtual > this.quantidadeCriticosAnterior) {
        // Usamos untracked para evitar ciclos infinitos de signal
        untracked(() => {
          this.exibirAlertaManual.set(true);
        });
      }
      
      // Atualiza a contagem para a próxima verificação
      this.quantidadeCriticosAnterior = quantidadeAtual;
    });
  }

  fecharNotificacao() {
    this.exibirAlertaManual.set(false);
  }

  ngOnInit(): void {
    this.carregarDados();
    // Atualiza os dados a cada 5 segundos
    this.intervalId = setInterval(() => {
      this.carregarDados();
    }, 5000);
  }

  // Limpa o intervalo quando o componente for destruído
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
 
  carregarDados() {
    this.services.listarAtivos().subscribe({
      next: (dados) => this.listaAtivos.set(dados),
      error: (err) => console.error('Erro ao carregar ativos:', err)
    });
  }
}
