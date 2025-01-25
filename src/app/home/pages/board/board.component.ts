import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ListComponent} from '../../components/list/list.component';
import {BoardDetails} from '../../../core/interfaces/boardDetails.interface';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BoardService} from '../../services/board.service';
import {BoardDetailsService} from '../../services/board-details.service';
import {ModalInputComponent} from '../../components/modal-input/modal-input.component';
import {ListService} from '../../services/list.service';
import {TitleInputComponent} from '../../components/title-input/title-input.component';

@Component({
  selector: 'tr-board',
  // host: { '[style.background-image]': `"url(/assets/images/series-2-pika-wallpaper-2.png)"` },
  imports: [
    ListComponent,
    FormsModule,
    ModalInputComponent,
    TitleInputComponent,
    RouterLink,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {

  board!: BoardDetails;
  boardId?: string | null;
  currentTitle: string = '';
  isEditing: boolean = false;
  isModalOpen: boolean = false;

  constructor(private route: ActivatedRoute,
              private boardService: BoardService,
              private boardDetailsService: BoardDetailsService,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
              private listService: ListService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({board}) => this.board = board);
    this.boardId = this.route.snapshot.paramMap.get('id');
    this.currentTitle = this.board.title;
  }

  removeBoard() {
    if (this.boardId) {
      this.boardService.removeBoard(this.boardId).subscribe(() => {
        this.router.navigate(['/'])
      });
    }
  }

  updateBoard() {
    if (this.boardId && (this.currentTitle && this.currentTitle !== this.board.title)) {
      this.boardService.updateBoard(this.currentTitle, this.boardId).subscribe(() => {
        if (this.boardId) {
          this.fetchBoard(this.boardId);
        }
      });
    } else {
      this.isEditing = false;
    }
  }

  fetchBoard(boardId: string) {
    this.boardDetailsService.getBoardDetails(boardId).subscribe((bord) => {
      this.board = bord;
      this.changeDetector.detectChanges();
      this.isEditing = false;
    });
  }

  createList(listTitle: string) {
    this.closeModal();
    if (this.boardId) {
      this.listService.createList(this.boardId, listTitle, this.board.lists.length - 1)
        .subscribe(() => {
          if (this.boardId) {
            this.fetchBoard(this.boardId);
          }
        });
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
