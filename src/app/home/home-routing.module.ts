import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './pages/board/board.component';
import {HomeComponent} from './pages/home/home.component';
import {boardDetailsResolver} from './resolvers/boardDetails.resolver';
import {boardResolver} from './resolvers/board.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {boards: boardResolver}
  },
  {
    path: 'board/:id',
    component: BoardComponent,
    resolve: {board: boardDetailsResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
