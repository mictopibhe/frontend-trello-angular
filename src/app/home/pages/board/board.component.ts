import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ListComponent} from '../../components/list/list.component';

@Component({
  selector: 'tr-board',
  imports: [
    NgForOf,
    ListComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent {
  board = {
    title: "Моя дошка",
    lists: [
      {
        id: 1,
        title: "Заплановані справи",
        cards: [
          {id: 1, title: "вимити свою кішечку"},
          {id: 2, title: "поспати"},
          {id: 3, title: "сходити в магазин"}
        ]
      },
      {
        id: 2,
        title: "В процесі",
        cards: [
          {id: 4, title: "подивитись серіальчик"},
          {id: 5, title: "покакати"}
        ]
      },
      {
        id: 3,
        title: "Виконано",
        cards: [
          {id: 6, title: "покакати"},
          {id: 7, title: "попрацювати"}
        ]
      },
      {
        id: 3,
        title: "Виконано",
        cards: [
          {id: 6, title: "покакати"},
          {id: 7, title: "попрацювати"}
        ]
      },
      {
        id: 3,
        title: "Виконано",
        cards: [
          {id: 6, title: "покакати"},
          {id: 7, title: "попрацювати"}
        ]
      }
    ]
  };
}
