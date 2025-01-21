import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ListComponent} from '../../components/list/list.component';
import {BoardDetails} from '../../../core/interfaces/boardDetails.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {BoardService} from '../../services/board.service';
import {BoardDetailsService} from '../../services/board-details.service';
import {InputFormComponent} from '../../components/input-form/input-form.component';

@Component({
  selector: 'tr-board',
  imports: [
    NgForOf,
    ListComponent,
    FormsModule,
    NgIf,
    InputFormComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {
  board!: BoardDetails;
  boardId?: string | null;
  inputValue: string = '';
  isChanging: boolean = false;
  isModalOpen: boolean = false;

  constructor(private route: ActivatedRoute,
              private boardService: BoardService,
              private boardDetailsService: BoardDetailsService,
              private router: Router,
              private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({board}) => this.board = board);
    this.boardId = this.route.snapshot.paramMap.get('id');
    this.inputValue = this.board.title;
  }

  removeBoard() {
    if (this.boardId) {
      this.boardService.removeBoard(this.boardId).subscribe(() => {
        this.router.navigate(['/'])
      });
    }
  }

  updateBoard() {
    if (this.boardId && (this.inputValue && this.inputValue !== this.board.title)) {
      this.boardService.updateBoard(this.inputValue, this.boardId).subscribe(() => {
        if (this.boardId) {
          this.fetchBoard(this.boardId);
        }
      });
    }
  }

  fetchBoard(boardId: string) {
    this.boardDetailsService.getBoardDetails(boardId).subscribe((bord) => {
      this.isChanging = false;
      this.board = bord;
      this.changeDetector.detectChanges();
    });
  }

  createList(listTitle: string) {
    this.closeModal();

  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
