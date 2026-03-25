import { Component, signal, OnInit, inject, OnDestroy, computed, effect, untracked, viewChild, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtivoService, Ativo } from './services/ativo';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
  @ViewChild('cpuChart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;

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
    // Esse effect observa a listaAtivos. Se ela mudar (via polling), o gráfico atualiza!
    effect(() => {
      const dados = this.listaAtivos();
      if (dados.length > 0) {
        this.updateChart(dados);
      }
    });
  }

  updateChart(ativos: Ativo[]) {
    const labels = ativos.map(a => a.nome_ativo);
    const valores = ativos.map(a => a.carga_cpu);

    // Destrói o gráfico anterior antes de recriar
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.chartCanvas) {
      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar', 
        data: {
          labels: labels,
          datasets: [{
            label: 'Carga de CPU (%)',
            data: valores,
            backgroundColor: ativos.map(a => a.carga_cpu > 80 ? '#e74c3c' : '#3498db'),
            borderRadius: 6,
            borderWidth: 0 
          }]
        },
        options: {
          indexAxis: 'y', 
          responsive: true,
          maintainAspectRatio: false, 
          scales: {
            x: { 
              beginAtZero: true, 
              max: 100, 
              grid: { display: false }
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { weight: 'bold' }
              }
            }
          },
        }
      });
    }
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

  deletarAtivo(id: number) {
  if (confirm('Tem certeza que deseja excluir este ativo?')) {
      this.services.deletarAtivo(id).subscribe({
        next: () => {
          this.carregarDados();
        },
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }
}
