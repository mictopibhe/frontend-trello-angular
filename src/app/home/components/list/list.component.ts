import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../core/interfaces/card.interface';
import {NgForOf} from '@angular/common';
import {CardComponent} from '../card/card.component';
import {ListService} from '../../services/list.service';
import {ActivatedRoute} from '@angular/router';
import {TitleInputComponent} from '../title-input/title-input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'tr-list',
  imports: [
    CardComponent,
    TitleInputComponent,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  constructor(private listService: ListService,
              private readonly route: ActivatedRoute) {
  }

  @Input() listId!: string;
  @Input() title!: string;
  @Input() cards!: Card[];

  @Output() listRemoved = new EventEmitter<void>();
  @Output() listUpdated = new EventEmitter<void>();

  boardId: string | null = null;
  isEditing: boolean = false;
  newTitle: string = '';

  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('id');
    this.newTitle = this.title;
  }

  removeList() {
    if (this.boardId) {
      this.listService.removeList(this.listId, this.boardId).subscribe(() => {
        //todo: update don't work. I don't know why!
        this.listRemoved.emit();
      });
    }
  }

  updateListTitle() {
    if (this.boardId && (this.newTitle && this.newTitle !== this.title)) {
      this.listService.updateListTitle(this.listId, this.boardId, this.title).subscribe(() => {
        this.isEditing = false;
        this.listUpdated.emit();
      });
    } else {
      this.isEditing = false;
    }
  }

  updateList() {
    this.listUpdated.emit();
  }
}
