import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BoardService} from '../../services/board.service';
import {BoardDetails} from '../../core/interfaces/boardDetails.interface';
import {ModalInputComponent} from '../../components/modal-input/modal-input.component';
import {TitleInputComponent} from '../../components/title-input/title-input.component';
import {ListService} from '../../services/list.service';
import {ListComponent} from '../../components/list/list.component';

@Component({
  selector: 'app-board',
  imports: [
    ModalInputComponent,
    TitleInputComponent,
    RouterLink,
    ListComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  private listService = inject(ListService);

  board = signal<BoardDetails | null>(null);
  boardId = signal<number>(Number(this.route.snapshot.params['id']));
  currentTitle = '';

  isModalOpen = signal<boolean>(false);
  isTitleEditing = signal<boolean>(false);

  ngOnInit(): void {
    document.documentElement.style.setProperty(
      '--background-image', 'url("/frontend-trello-angular/assets/board-bg.png")'
    );
    const resolvedBoard: BoardDetails = this.route.snapshot.data['board'];
    this.board.set(resolvedBoard);
    this.currentTitle = this.board()!.title;
  }

  fetchBoard() {
    this.boardService
      .fetchBoard(this.boardId())
      .subscribe((board) => this.board.set(board));
  }

  updateBoardTitle(title: string) {
    if (title && this.board()?.title !== title){
      this.boardService
        .updateBoard(title, this.boardId())
        .subscribe(() => {
          this.fetchBoard();
        });
    }
    this.isTitleEditing.set(false);
  }

  removeBoard() {
    this.boardService
      .removeBoard(this.boardId())
      .subscribe(() => this.router.navigate(['/']));
  }

  createList(listTitle: string) {
    this.listService.createList(this.boardId(), listTitle, this.board()?.lists?.length)
      .subscribe(() => {
        this.fetchBoard();
      });
    this.isModalOpen.set(false);
  }
}
