import { Component, signal, OnInit, inject, OnDestroy, computed, effect, untracked, viewChild, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtivoService, Ativo } from './services/ativo';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // Necessário para usar *ngFor e Pipes de data
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit, OnDestroy {
  private services = inject(AtivoService);
  public listaAtivos = signal<Ativo[]>([]);
  public idEmEdicao = signal<number | null>(null);
  public ativoSelecionado: Ativo = {} as Ativo;
  private intervalId: any;
  @ViewChild('cpuChart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;

  // Signal para controle manual do "X"
  public exibirAlertaManual = signal(true);

  // Signal Computado: Sempre que listaAtivos mudar, ele filtra os críticos (> 90%)
  public ativosCriticos = computed(() => 
    this.listaAtivos().filter(a => a.carga_cpu >= 90 || a.status.toLowerCase() === 'alerta')
  );

  // Signal final que decide se mostra ou não (Lógica + Controle Manual)
  public mostrarNotificacao = computed(() => 
    this.ativosCriticos().length > 0 && this.exibirAlertaManual()
  );

  constructor() {
    // Esse effect observa a listaAtivos. Se ela mudar (via polling), o gráfico atualiza!
    effect(() => {
      const dados = this.listaAtivos();
      untracked(() => {
        if (dados.length > 0) {
          this.updateChart(dados);
        }
      });
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
            backgroundColor: ativos.map(a => a.carga_cpu > 90 ? '#e74c3c' : '#3498db'),
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
    if (this.intervalId) {clearInterval(this.intervalId);}
    if (this.chart) { this.chart.destroy(); }
  }
 
  carregarDados() {
    this.services.listarAtivos().subscribe({
      next: (dadosNovos) => {
        // Converte ambos para string para uma comparação rápida e simples
        const dadosAtuaisStr = JSON.stringify(this.listaAtivos());
        const dadosNovosStr = JSON.stringify(dadosNovos);

        // SÓ atualiza o Signal se houver mudança real nos dados
        if (dadosAtuaisStr !== dadosNovosStr) {
          this.listaAtivos.set(dadosNovos);
          // Se novos críticos surgirem, resetamos o alerta manual para mostrar a notificação
          if (dadosNovos.some(a => a.carga_cpu >= 90)) {
             this.exibirAlertaManual.set(true);
          }
        }
      },
      error: (err) => console.error('Erro ao carregar ativos:', err)
    });
  }

  iniciarEdicao(ativo: Ativo) {
    this.idEmEdicao.set(ativo.id!);
    // Criamos uma cópia para não editar o objeto original da lista antes de salvar
    this.ativoSelecionado = { ...ativo };
  }

  salvarEdicao(ativo: Ativo) {
    if (ativo.status !== 'Offline' && ativo.carga_cpu >= 90) {
      ativo.status = 'Alerta';
    } else if (ativo.status === 'Alerta' && ativo.carga_cpu < 90) {
      ativo.status = 'Online';
    }
    this.services.atualizarAtivo(ativo.id!, ativo).subscribe({
      next: () => {
        this.idEmEdicao.set(null);
        this.carregarDados();
      },
      error: (err) => alert('Erro ao salvar!')
    });
  }

  cancelarEdicao() {
    this.idEmEdicao.set(null);
    this.carregarDados(); // Reverte mudanças visuais não salvas
  }

  deletarAtivo(id: number | undefined) {
    if (!id) return; // Segurança contra IDs nulos
    
    if (confirm('Tem certeza que deseja remover este ativo do monitoramento?')) {
      this.services.deletarAtivo(id).subscribe({
        next: () => {
          console.log(`Ativo ${id} removido.`);
          this.carregarDados(); // Recarrega para limpar o gráfico e a lista
        },
        error: (err) => alert('Erro ao excluir: Verifique a conexão com o servidor.')
      });
    }
  }
}
