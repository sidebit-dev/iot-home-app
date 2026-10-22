import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../../events/events-service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  imports: [CommonModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss',
})
export class Eventos implements OnInit, OnDestroy {
  events: any[] = [];
  private eventSub!: Subscription;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventSub = this.eventService.getServerSentEvents().subscribe({
      next: (data) => {
        this.events.unshift(data); // Adiciona o novo evento no topo da lista
      },
      error: (err) => console.error('Erro na conexão SSE:', err)
    });
  }
  ngOnDestroy() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }
}
