import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {boardsResolver} from './resolvers/boards.resolver';
import {BoardComponent} from './pages/board/board.component';
import {boardDetailsResolver} from './resolvers/board-details.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { boards: boardsResolver } },
  {path: 'board/:id', component: BoardComponent, resolve: {board: boardDetailsResolver}}
];
