import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {BoardService} from './services/board.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomeComponent} from './pages/home/home.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ],
  providers: [BoardService],
})
export class HomeModule {
}
