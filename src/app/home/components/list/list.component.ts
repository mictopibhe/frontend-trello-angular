import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output, signal,} from '@angular/core';
import {Card} from '../../../core/interfaces/card.interface';
import {CardComponent} from '../card/card.component';
import {ListService} from '../../services/list.service';
import {ActivatedRoute} from '@angular/router';
import {TitleInputComponent} from '../title-input/title-input.component';
import {FormsModule} from '@angular/forms';
import {CardService} from '../../services/card.service';
import {CardCreationFormComponent} from '../card-creation-form/card-creation-form.component';
import {CardUpdate} from '../../../core/interfaces/cardUpdate.interface';

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
  listService = inject(ListService);
  cardService = inject(CardService);
  route = inject(ActivatedRoute);

  @Input() listId!: number;
  @Input() title!: string;
  @Input() cards!: Card[];

  @Output() listRemoved = new EventEmitter<void>();
  @Output() listUpdated = new EventEmitter<void>();

  boardId = signal<number>(0);
  isTitleEditing: boolean = false;
  isCardCreationEnabled: boolean = false;
  newTitle: string = '';

  sourceList = signal<Card[]>([]);
  sourceListId = signal<number | null>(null);
  sourceCard = signal<Card | null>(null);
  placeholder = signal<HTMLDivElement | null>(null);
  draggedElement = signal<HTMLElement | null>(null);

  ngOnInit(): void {
    this.boardId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.newTitle = this.title;
    this.cards.sort((a, b) => a.position - b.position);
    const placeholderElement = Array.from(document.getElementsByClassName('placeholder'))[0] as HTMLDivElement;
    placeholderElement.parentNode?.removeChild(placeholderElement);
    this.placeholder.set(placeholderElement);
  }

  removeList() {
    if (this.boardId()) {
      this.listService.removeList(this.listId, this.boardId()).subscribe(() => {
        //todo: update don't work. I don't know why!
        this.listRemoved.emit();
      });
    }
  }

  updateListTitle() {
    if (this.isTitleChanged()) {
      this.listService.updateListTitle(this.listId, this.boardId(), this.newTitle).subscribe(() => {
        //todo: update don't work. I don't know why!
        this.listUpdated.emit();
      });
    }
    this.isTitleEditing = false;
  }

  isTitleChanged(): boolean {
    return this.newTitle?.trim() !== this.title?.trim();
  }

  createNewCard(card: { title: string; description: string }) {
    if (card.title) {
      this.cardService.createCard(this.boardId(), this.listId, card.title, card.description, this.cards.length)
        .subscribe(() => {
          this.updateList();
        });
    }
    this.isCardCreationEnabled = false;
  }

  updateList() {
    this.listUpdated.emit();
  }

  onDragStart(event: DragEvent, card: Card) {
    console.log(card);
    this.sourceList.set(this.cards);
    this.sourceCard.set(card);
    this.sourceListId.set(this.listId);
    this.draggedElement.set(event.target as HTMLElement);

    event.dataTransfer?.setData('text/plain', JSON.stringify(card));

    //todo: add styles for element
    //event.dataTransfer!.dropEffect = "copy"; //поки не зрозуміло, як працює (повинен змінюватись курсор але поки не змінюється)
    // const target = event.target as HTMLElement;
    // target.classList.add('dragging');
  }

  onDragLeave(event: DragEvent) {
    this.sourceList.set(this.sourceList().filter((card) => card !== this.sourceCard()));
    const draggedElement = this.draggedElement();
    if (draggedElement) {
      draggedElement.parentNode?.removeChild(draggedElement);
    }

    const list = event.currentTarget as HTMLElement;
    const listRect = list.getBoundingClientRect();

    if (this.isMouseLeaveDropZone(listRect, event.clientX, event.clientY)) {
      const placeholder = this.placeholder()!;
      this.placeholder()!.parentNode?.removeChild(this.placeholder()!);
    }
  }

  isMouseLeaveDropZone(
    listRect: DOMRect, mouseX: number, mouseY: number
  ): boolean {
    return (
      mouseY < listRect.top || mouseY > listRect.bottom ||
      mouseX < listRect.left || mouseX > listRect.right
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const list = event.currentTarget as HTMLElement;
    //todo: add visual effect for drop area
    list.classList.add();
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const list = event.currentTarget as HTMLElement;

    const cardComponents = Array.from(list.children).filter(
      (child) => !child.classList.contains('placeholder')
    );

    let insertIndex = cardComponents.findIndex((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterY = cardRect.top + cardRect.height / 2;
      return event.clientY < cardCenterY;
    });

    insertIndex = insertIndex === -1 ? cardComponents.length : insertIndex;
    list.insertBefore(this.placeholder()!, cardComponents[insertIndex]);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const  rawData = event.dataTransfer?.getData("text/plain");
    console.log(rawData);
    if (rawData) {
      this.sourceCard.set(JSON.parse(rawData));
    }
    const list = event.currentTarget as HTMLElement;
    const dropPosition = Array.from(list.children).findIndex((el) => {
      return el.classList.contains('placeholder');
    }) + 1;
    console.log(dropPosition);

    if (dropPosition === -1) {
      console.error('Placeholder not found');
      return;
    }
    this.placeholder()!.parentNode!.removeChild(this.placeholder()!);

    console.log(this.sourceCard()!.id);
    const droppedCard: CardUpdate = {
      id: this.sourceCard()!.id,
      position: dropPosition,
      list_id: this.listId
    };

    const updatedSourceCardsList: CardUpdate[] = this.sourceList()
      .filter((card) => card.position > dropPosition)
      .map((card): CardUpdate => ({
          id: card.id,
          position: card.position - 1,
          list_id: this.sourceListId()!
        })
      );
    console.log(updatedSourceCardsList);
    const updatedTargetCardsList: CardUpdate[] = this.cards
      .filter((_, index) => index >= dropPosition)
      .map((card): CardUpdate => ({
          id: card.id,
          position: card.position + 1,
          list_id: this.listId
        })
      );
    updatedTargetCardsList.splice(dropPosition, 0, droppedCard);
    this.cardService.updateCards(
      this.boardId(),
      [...updatedSourceCardsList, ...updatedTargetCardsList]
    ).subscribe( () => {
      this.listUpdated.emit();
    });
    console.log([...updatedSourceCardsList, ...updatedTargetCardsList]);
  }
}
