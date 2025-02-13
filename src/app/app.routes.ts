import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {boardsResolver} from './resolvers/boards.resolver';
import {BoardComponent} from './pages/board/board.component';
import {boardDetailsResolver} from './resolvers/board-details.resolver';
import {CardDetailsComponent} from './pages/card-details/card-details.component';
import {RegisterComponent} from './pages/register/register.component';

export const routes: Routes = [
  {path: '', component: HomeComponent, resolve: {boards: boardsResolver}},
  {path: 'board/:id', component: BoardComponent, resolve: {board: boardDetailsResolver}},
  {path: 'board/:boardId/card/:cardId', component: CardDetailsComponent},
  {path: 'register', component: RegisterComponent}
];
