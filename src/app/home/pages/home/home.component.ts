import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Board} from '../../../core/interfaces/board.interface';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {InputFormComponent} from '../../components/input-form/input-form.component';
import {BoardService} from '../../services/board.service';
import {switchMap} from 'rxjs';

@Component({
  selector: 'tr-home',
  imports: [
    RouterLink,
    InputFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  boards: Board[] = [];
  isModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.boards = data['boards'];
    });
  }

  createBoard(title: string) {
    this.boardService.createBoard(title).pipe(
      switchMap(() => this.boardService.getBoards())
    ).subscribe(boards => {
      this.boards = boards;
      this.isModalOpen = false;
      this.changeDetector.detectChanges();
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
