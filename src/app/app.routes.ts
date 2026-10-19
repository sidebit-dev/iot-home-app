import { Routes } from '@angular/router';
import { Template } from './template/template';
import { CreateTicket } from './tickets/create-ticket/create-ticket';
import { CreateSensor } from './sensors/create-sensor/create-sensor';
import { ListagemTickets } from './tickets/listagem-tickets/listagem-tickets';
import { ListagemSensors } from './sensors/listagem-sensors/listagem-sensors';
import { ListLogSensors } from './log-sensors/list-log-sensors/list-log-sensors';
import { CreateLogSensor } from './log-sensors/create-log-sensor/create-log-sensor';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';

export const routes: Routes = [
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
        path: 'create-log-sensor',
        component: CreateLogSensor,
      },
      {
        path: 'list-log-sensors',
        component: ListLogSensors,
      }
    ],
  },
];
