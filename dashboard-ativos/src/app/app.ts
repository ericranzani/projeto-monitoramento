import { Component, signal, OnInit, inject, OnDestroy, computed, effect, untracked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtivoService, Ativo } from './services/ativo';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private services = inject(AtivoService);
  public listaAtivos = signal<Ativo[]>([]);
  public idEmEdicao = signal<number | null>(null);
  public ativoSelecionado: Ativo = {} as Ativo;
  
  // WebSocket: Substituímos o intervalId pelo objeto do Socket
  private socket: WebSocket | undefined;

  @ViewChild('cpuChart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;

  public exibirAlertaManual = signal(true);

  public ativosCriticos = computed(() => 
    this.listaAtivos().filter(a => a.carga_cpu >= 90 || a.status.toLowerCase() === 'alerta')
  );

  public mostrarNotificacao = computed(() => 
    this.ativosCriticos().length > 0 && this.exibirAlertaManual()
  );

  constructor() {
    effect(() => {
      const dados = this.listaAtivos();
      untracked(() => {
        if (dados.length > 0) {
          this.updateChart(dados);
        }
      });
    });
  }

  // --- LÓGICA DO WEBSOCKET ---
  conectarWebSocket() {
    // Conecta no endereço que definimos no Python (prefixo /ativos + rota /ws)
    this.socket = new WebSocket('ws://127.0.0.1:8000/ativos/ws');

    this.socket.onmessage = (event) => {
      // Se o Python enviar a string "atualizar", nós buscamos os dados novos
      if (event.data === 'atualizar') {
        console.log('⚡ Mudança detectada no servidor! Atualizando dados...');
        this.carregarDados();
      }
    };

    this.socket.onclose = () => {
      console.warn('⚠️ WebSocket desconectado. Tentando reconectar em 3s...');
      setTimeout(() => this.conectarWebSocket(), 3000);
    };

    this.socket.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
    };
  }

  ngOnInit(): void {
    this.carregarDados();
    this.conectarWebSocket();
  }

  ngOnDestroy(): void {
    // Fecha o socket quando sair da página para não gastar memória
    if (this.socket) {
      this.socket.close();
    }
    if (this.chart) { 
      this.chart.destroy(); 
    }
  }

  carregarDados() {
    this.services.listarAtivos().subscribe({
      next: (dadosNovos) => {
        this.listaAtivos.set(dadosNovos);
        if (dadosNovos.some(a => a.carga_cpu >= 90)) {
          this.exibirAlertaManual.set(true);
        }
      },
      error: (err) => console.error('Erro ao carregar ativos:', err)
    });
  }

  // --- GRÁFICO ---
  updateChart(ativos: Ativo[]) {
    const labels = ativos.map(a => a.nome_ativo);
    const valores = ativos.map(a => a.carga_cpu);

    if (this.chart) { this.chart.destroy(); }

    if (this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar', 
        data: {
          labels: labels,
          datasets: [{
            label: 'Carga de CPU (%)',
            data: valores,
            backgroundColor: ativos.map(a => a.carga_cpu > 90 ? '#e74c3c' : '#3498db'),
            borderRadius: 6,
          }]
        },
        options: {
          indexAxis: 'y', 
          responsive: true,
          maintainAspectRatio: false, 
          scales: {
            x: { beginAtZero: true, max: 100, grid: { display: false } },
            y: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
          },
        }
      });
    }
  }

  // --- AÇÕES DO CRUD ---
  iniciarNovoAtivo() {
    this.idEmEdicao.set(0);
    this.ativoSelecionado = { nome_ativo: '', status: 'Online', carga_cpu: 0 } as Ativo;
  }

  iniciarEdicao(ativo: Ativo) {
    this.idEmEdicao.set(ativo.id!);
    this.ativoSelecionado = { ...ativo };
  }

  salvarEdicao(ativo: Ativo) {
    // A regra de alerta agora é reforçada pelo Backend, mas mantemos aqui para UX rápida
    if (ativo.status !== 'Offline' && ativo.carga_cpu >= 90) {
      ativo.status = 'Alerta';
    } else if (ativo.status === 'Alerta' && ativo.carga_cpu < 90) {
      ativo.status = 'Online';
    }

    if (ativo.id) {
      this.services.atualizarAtivo(ativo.id, ativo).subscribe({
        next: () => this.idEmEdicao.set(null), // O WebSocket chamará o carregarDados()
        error: (err) => console.error(err)
      });
    } else {
      const { id, ultima_atualizacao, ...novoAtivo } = ativo;
      this.services.criarAtivo(novoAtivo as Ativo).subscribe({
        next: () => this.idEmEdicao.set(null),
        error: (err) => alert('Erro ao criar: Verifique o console.')
      });
    }
  }

  cancelarEdicao() {
    this.idEmEdicao.set(null);
  }

  fecharNotificacao() {
    this.exibirAlertaManual.set(false);
  }

  deletarAtivo(id: number | undefined) {
    if (!id || !confirm('Deseja remover este ativo?')) return;
    this.services.deletarAtivo(id).subscribe({
      next: () => console.log('Removido'),
      error: (err) => alert('Erro ao excluir')
    });
  }
}