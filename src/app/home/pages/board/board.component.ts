import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ListComponent} from '../../components/list/list.component';
import {Board} from '../../../core/interfaces/board.interface';
import {ActivatedRoute} from '@angular/router';

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
export class BoardComponent implements OnInit {
  board?: Board;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ board }) => this.board = board);
  }
}
