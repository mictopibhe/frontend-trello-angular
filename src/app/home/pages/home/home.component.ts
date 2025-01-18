import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Boards} from '../../../core/interfaces/boards.interface';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'tr-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  boards: Boards[] = [
    {id: 1, title: "закупи в кишенці", color:"#1f4ce0"},
    {id: 2, title: "підготовка до весілля", color:"#1f4ce0"},
    {id: 3, title: "розробка ммо рпг гри", color:"#e2ac4a"},
    {id: 4, title: "курс по кунілінгусу", color:"#e2ac4a"}
  ];
}
