import { Component, signal, OnInit, inject, OnDestroy } from '@angular/core';
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
