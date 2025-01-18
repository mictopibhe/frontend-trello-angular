import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './pages/board/board.component';
import {HomeComponent} from './pages/home/home.component';
import {boardResolver} from './resolvers/board.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'board/:id',
    component: BoardComponent,
    resolve: { board: boardResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
