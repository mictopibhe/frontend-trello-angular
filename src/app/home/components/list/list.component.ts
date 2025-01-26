import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, Renderer2
} from '@angular/core';
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
              private readonly route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
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

  placeholder!: HTMLDivElement;
  draggedElement?: HTMLElement | null = null;


  ngOnInit(): void {
    this.boardId = this.route.snapshot.paramMap.get('id');
    this.newTitle = this.title;
    this.cards.sort((a, b) => a.position - b.position);
    this.placeholder = Array.from(document.getElementsByClassName('placeholder'))[0] as HTMLDivElement;
    this.placeholder.parentNode?.removeChild(this.placeholder);
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

  onDragStart(event: DragEvent, card: Card) {
    this.draggedElement = event.target as HTMLElement;
    event.dataTransfer!.setData('application/json', JSON.stringify(card));
    //event.dataTransfer!.dropEffect = "copy"; //поки не зрозуміло, як працює (повинен змінюватись курсор але поки не змінюється)
    // const target = event.target as HTMLElement;
    // target.classList.add('dragging');
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    const list = event.currentTarget as HTMLElement;

    const cardComponents = Array.from(list.children).filter(
      (child) => !child.classList.contains('placeholder')
    );

    const mouseY = event.clientY;
    let insertIndex = cardComponents.findIndex((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterY = cardRect.top + cardRect.height / 2;
      return mouseY < cardCenterY;
    });

    insertIndex = insertIndex === -1 ? cardComponents.length : insertIndex;
    const targetCard = cardComponents[insertIndex] || null;
    list.insertBefore(this.placeholder, targetCard);
  }

  onDragLeave(event: DragEvent) {
    const list = event.target as HTMLElement;
    const listRect = list.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (this.isMouseLeaveDropZone(listRect, mouseX, mouseY)) {
      // якщо тягнути карту прямо в самий верх листа а потім на інший список - плейсхолдер лишається
      // @ts-ignore
      this.placeholder.parentNode.removeChild(this.placeholder);
    }
  }

  isMouseLeaveDropZone(listRect: DOMRect, mouseX: number, mouseY: number) {
    return (listRect.top < mouseY && listRect.bottom > mouseY) ||
      (listRect.left > mouseX && listRect.right < mouseX);
  }
}
