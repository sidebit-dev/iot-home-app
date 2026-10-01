import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CreateTicket } from './tickets/create-ticket/create-ticket';
import { ListagemTickets } from './tickets/listagem-tickets/listagem-tickets';

export const routes: Routes = [
  {
    path: 'paginas',
    component: Template,
    children: [
      {
        path: 'create-ticket',
        component: CreateTicket,
      },
      {
        path: 'list-tickets',
        component: ListagemTickets,
      }
    ],
  },
];
