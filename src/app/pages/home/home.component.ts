import {Component, inject, OnInit, signal} from '@angular/core';
import {IBoard} from '../../core/interfaces/board.interface';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BoardService} from '../../services/board.service';
import {switchMap} from 'rxjs';
import {ModalInputComponent} from '../../components/modal-input/modal-input.component';

@Component({
  selector: 'app-home',
  host: {'[style.background-image]': `"url('/frontend-trello-angular/assets/home-bg.jpg')"`},
  imports: [
    RouterLink,
    ModalInputComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);

  boards = signal<IBoard[]>([]);
  isModalOpen = signal<boolean>(false);

  ngOnInit(): void {
    const resolvedBoards = this.route.snapshot.data['boards'];
    this.boards.set(resolvedBoards || []);
  }

  createBoard(event: string) {
    this.boardService.createBoard(event).pipe(
      switchMap(() => this.boardService.fetchBoards())
    ).subscribe((boards) => {
      this.boards.set(boards);
      this.isModalOpen.set(false);
    });
  }
}
