import { ChangeDetectionStrategy, Component } from '@angular/core';
import {IBoard} from '../../../core/interfaces/iboard.interface';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'tr-home',
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  boards: IBoard[] = [
    {id: 1, title: "закупи в кишенці", color:"#1f4ce0"},
    {id: 2, title: "підготовка до весілля", color:"#1f4ce0"},
    {id: 3, title: "розробка ммо рпг гри", color:"#e2ac4a"},
    {id: 4, title: "курс по кунілінгусу", color:"#e2ac4a"}
  ];
}
