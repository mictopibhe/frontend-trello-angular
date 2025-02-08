import {ChangeDetectionStrategy, Component, EventEmitter, inject, input, OnInit, Output, signal} from '@angular/core';
import {ListService} from '../../services/list.service';
import {ActivatedRoute} from '@angular/router';
import {CardsList} from '../../core/interfaces/cardList.interface';
import {TitleInputComponent} from '../title-input/title-input.component';
import {CardCreationFormComponent} from '../card-creation-form/card-creation-form.component';
import {CardService} from '../../services/card.service';
import {Card} from '../../core/interfaces/card.interface';
import {DragDropService} from '../../services/drag-drop.service';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-list',
  imports: [
    TitleInputComponent,
    CardCreationFormComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  private listService = inject(ListService);
  private cardService = inject(CardService);
  private route = inject(ActivatedRoute);
  private dragNDropService = inject(DragDropService);

  list = input.required<CardsList>();
  @Output() listChanged = new EventEmitter<void>();

  currentTitle: string = '';
  isTitleEditing = signal(false);
  isCardCreationEnabled = signal(false);

  boardId = signal<number>(Number(this.route.snapshot.params['id']));
  draggedCard = signal<Card | null>(null);
  dropPosition = signal<number | null>(null);

  ngOnInit(): void {
    document.addEventListener('drop', this.onDropOutside.bind(this));
    document.addEventListener('dragover', (event) => event.preventDefault());
    this.currentTitle = this.list().title;
    this.list().cards = this.list().cards.sort((a, b) => a.position - b.position);
  }

  updateListTitle(title: string) {
    this.listService.updateListTitle(title, this.boardId(), this.list().id).subscribe(() => {
      this.listChanged.emit();
      this.isTitleEditing.set(false);
    });
  }

  removeList() {
    this.listService.removeList(this.boardId(), this.list().id).subscribe(() => {
      this.listChanged.emit();
    });
  }

  addCard(newCard: { title: string, description: string }) {
    this.cardService.createCard(newCard, this.boardId(), this.list().id, this.list().cards.length + 1)
      .subscribe(() => {
          this.listChanged.emit();
          this.isCardCreationEnabled.set(false);
        }
      );
  }

  onDragStart(event: DragEvent, card: Card) {
    this.dragNDropService.targetList.set(this.list());
    this.dragNDropService.isDroppedInZone.set(false);
    this.draggedCard.set(card);
    event.dataTransfer?.setData('application/json', JSON.stringify(card));
  }

  onDragLeave(event: DragEvent) {
    if (this.isMouseLeaveDropZone(event)) {
      this.dropPosition.set(null);
      this.draggedCard.set(null);
    }
    if (!this.draggedCard()) return;
    if (this.list().cards.some((card) => card.id === this.draggedCard()!.id)) {
      this.list().cards = this.list().cards
        .filter((card) => card.id !== this.draggedCard()!.id)
        .map((card) => {
          if (card.position > this.draggedCard()!.position) {
            return {...card, position: card.position - 1}
          }
          return card;
        });
      this.dragNDropService.targetList.set(this.list());
    }
  }

  isMouseLeaveDropZone(event: DragEvent): boolean {
    const targetRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return (
      event.clientY < targetRect.top || event.clientY > targetRect.bottom ||
      event.clientX < targetRect.left || event.clientX > targetRect.right
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const currentTarget = event.currentTarget as HTMLElement;

    this.dropPosition.set(
      Array.from(currentTarget.children)
        .filter((el) => !el.classList.contains('placeholder'))
        .findIndex((el) => {
          const elRect = el.getBoundingClientRect();
          const elCenterY = elRect.top + elRect.height / 2;
          return event.clientY < elCenterY;
        })
    );
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragNDropService.isDroppedInZone.set(true);

    const rawData = event.dataTransfer?.getData('application/json');
    if (!rawData) return;

    const card: Card = JSON.parse(rawData);
    const updatedList = (this.list().id) ? this.list() : this.dragNDropService.targetList()!;
    if (this.list().id) {
      card.position = (this.dropPosition() === -1 && this.list().cards.length !== 0) ?
        this.list().cards.length + 1 : this.dropPosition()! + 1;
    }

    updatedList.cards.forEach((el, index) => {
      if (index >= card.position - 1) {
        updatedList.cards[index] = {...el, position: el.position + 1};
      }
    });
    updatedList.cards.splice(card.position - 1, 0, card);

    this.draggedCard.set(null);
    this.dropPosition.set(null);

    this.cardService.updateCards(
      this.boardId(),
      this.dragNDropService.targetList()!.id,
      this.dragNDropService.targetList()!.cards
    ).pipe(
      switchMap(() => {
        return this.cardService.updateCards(this.boardId(), updatedList.id, updatedList.cards);
      })
    ).subscribe({
      next: () => {
        this.listChanged.emit();
      },
      error: (err) => {
        console.error('Error while updating cards:', err);
      }
    });
  }

  onDropOutside(event: DragEvent) {
    event.preventDefault();

    setTimeout(() => {
      if (!this.dragNDropService.isDroppedInZone()) {
        this.draggedCard.set(null);
        this.dropPosition.set(null);
        this.listChanged.emit();
      }
    }, 0);
  }
}
