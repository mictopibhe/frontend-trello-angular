import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../core/interfaces/card.interface';
import {NgForOf} from '@angular/common';
import {CardComponent} from '../card/card.component';
import {ListService} from '../../services/list.service';
import {ActivatedRoute} from '@angular/router';
import {TitleInputComponent} from '../title-input/title-input.component';
import {FormsModule} from '@angular/forms';
import {CardService} from '../../services/card.service';
import {CardCreationFormComponent} from '../card-creation-form/card-creation-form.component';

@Component({
  selector: 'tr-list',
  imports: [
    CardComponent,
    TitleInputComponent,
    FormsModule,
    CardCreationFormComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  constructor(private listService: ListService,
              private cardService: CardService,
              private readonly route: ActivatedRoute) {
  }

  @Input() listId!: string;
  @Input() title!: string;
  @Input() cards!: Card[];

  @Output() listRemoved = new EventEmitter<void>();
  @Output() listUpdated = new EventEmitter<void>();

  boardId: string | null = null;
  isTitleEditing: boolean = false;
  isCardCreationEnabled: boolean = false;
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
      this.listService.updateListTitle(this.listId, this.boardId, this.newTitle).subscribe(() => {
        this.isTitleEditing = false;
        //todo: update don't work. I don't know why!
        this.listUpdated.emit();
      });
    } else {
      this.isTitleEditing = false;
    }
  }

  updateList() {
    this.listUpdated.emit();
  }

  createNewCard(card: { title: string; description: string }) {
    if (card.title && this.boardId) {
      this.cardService.createCard(this.boardId, this.listId, card.title, card.description, this.cards.length)
        .subscribe(() => {
          this.updateList();
        });
      this.isCardCreationEnabled = false;
    } else {
      this.isCardCreationEnabled = false;
    }
  }
}
