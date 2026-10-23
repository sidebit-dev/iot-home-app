import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CreateTicket } from './tickets/create-ticket/create-ticket';
import { CreateSensor } from './sensors/create-sensor/create-sensor';
import { ListagemTickets } from './tickets/listagem-tickets/listagem-tickets';
import { ListagemSensors } from './sensors/listagem-sensors/listagem-sensors';
import { ListEvents } from './events/list-events/list-events';
import { CreateEvent } from './events/create-event/create-event';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';
import { Login } from './auth/login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,   
  },
  {
    path: '',
    redirectTo: 'login',
     pathMatch: 'full',
  },
  {
    path: 'paginas',
    component: Template,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardPage,
      },
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
      },
      {
        path: 'create-event',
        component: CreateEvent,
      },
      {
        path: 'list-events',
        component: ListEvents,
      }
    ],
  },
];
