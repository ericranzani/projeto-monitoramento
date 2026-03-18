import { Component, signal, OnInit, inject } from '@angular/core';
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
export class App implements OnInit {
  private services = inject(AtivoService);

  public listaAtivos = signal<Ativo[]>([]);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.services.listarAtivos().subscribe({
      next: (dados) => this.listaAtivos.set(dados),
      error: (err) => console.error('Erro ao carregar ativos:', err)
    });
  }
}
