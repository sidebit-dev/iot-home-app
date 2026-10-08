import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CreateTicket } from './tickets/create-ticket/create-ticket';
import { CreateSensor } from './sensors/create-sensor/create-sensor';
import { ListagemTickets } from './tickets/listagem-tickets/listagem-tickets';
import { ListagemSensors } from './sensors/listagem-sensors/listagem-sensors';

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
      },
      {
        path: 'create-sensor',
        component: CreateSensor,
      },
      {
        path: 'list-sensors',
        component: ListagemSensors,
      }
    ],
  },
];
