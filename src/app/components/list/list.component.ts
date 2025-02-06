import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2,
  signal,
  ViewChild
} from '@angular/core';
import {ListService} from '../../services/list.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CardsList} from '../../core/interfaces/cardList.interface';
import {TitleInputComponent} from '../title-input/title-input.component';
import {CardComponent} from '../card/card.component';
import {CardCreationFormComponent} from '../card-creation-form/card-creation-form.component';
import {CardService} from '../../services/card.service';
import {Card} from '../../core/interfaces/card.interface';

@Component({
  selector: 'app-list',
  imports: [
    TitleInputComponent,
    CardComponent,
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
  private renderer = inject(Renderer2);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @Input() list!: CardsList;
  @Output() listChanged = new EventEmitter<void>();

  @ViewChild('placeholder') placeholder!: ElementRef;
  currentTitle: string = '';
  isTitleEditing = signal(false);
  isCardCreationEnabled = signal(false);

  boardId = signal<number>(Number(this.route.snapshot.params['id']));
  draggedCard = signal<Card | null>(null);

  ngOnInit(): void {
    this.currentTitle = this.list.title;
    this.list.cards = this.list.cards.sort((a, b) => a.position - b.position);
  }

  updateListTitle(title: string) {
    this.listService.updateListTitle(title, this.boardId(), this.list.id).subscribe(() => {
      this.listChanged.emit();
      this.isTitleEditing.set(false);
    });
  }

  removeList() {
    this.listService.removeList(this.boardId(), this.list.id).subscribe(() => {
      this.listChanged.emit();
    });
  }

  addCard(newCard: { title: string, description: string }) {
    this.cardService.createCard(newCard, this.boardId(), this.list.id, this.list.cards.length + 1).subscribe(() => {
        this.listChanged.emit();
        this.isCardCreationEnabled.set(false);
      }
    );
  }

  onDragStart(event: DragEvent, card: Card) {
    this.draggedCard.set(card);
    const data = {card, sourceListId: this.list.id};
    event.dataTransfer?.setData('application/json', JSON.stringify(data));
  }

  onDragLeave(event: DragEvent) {
    if (!this.draggedCard()) return;
    const updatedCards = this.list.cards
      .filter((card) => card.id !== this.draggedCard()!.id)
      .map((card) => {
        if (card.position > this.draggedCard()!.position) {
          return {...card, position: card.position - 1}
        }
        return card;
      });
    if (this.list.cards.length !== updatedCards.length) {
      this.list.cards = updatedCards;
      this.cardService.updateCards(this.boardId(), this.list).subscribe();
    }
    if (this.isMouseLeaveDropZone(event.currentTarget as HTMLElement, event.clientX, event.clientY)) {
      this.placeholder.nativeElement.remove();
    }
  }

  isMouseLeaveDropZone(
    target: HTMLElement, mouseX: number, mouseY: number
  ): boolean {
    const targetRect = target.getBoundingClientRect();
    return (
      mouseY < targetRect.top || mouseY > targetRect.bottom ||
      mouseX < targetRect.left || mouseX > targetRect.right
    );
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const currentTarget = event.currentTarget as HTMLElement;

    this.placeholder.nativeElement.style.display = 'none';
    const dropPosition = Array.from(currentTarget.children)
      .filter((el) => el.className !== this.placeholder.nativeElement.className)
      .findIndex((el) => {
        const elRect = el.getBoundingClientRect();
        const elCenterY = elRect.top + elRect.height / 2;
        return event.clientY < elCenterY;
      });

    if (dropPosition !== -1) {
      this.renderer.insertBefore(currentTarget, this.placeholder.nativeElement, currentTarget.children[dropPosition]);
    } else {
      this.renderer.appendChild(currentTarget, this.placeholder.nativeElement);
    }
    this.placeholder.nativeElement.style.display = 'block';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const rawData = event.dataTransfer?.getData('application/json');
    if (!rawData) return;

    const data: { card: Card; sourceListId: string } = JSON.parse(rawData);
    const target = event.currentTarget as HTMLElement;

    const elementsList = Array.from(target.children);
    const dropPosition = elementsList.findIndex((el) => el.className === 'placeholder');

    if (dropPosition > -1) {
      const updatedCards = [...this.list.cards];
      updatedCards.splice(dropPosition, 0, {...data.card, position: dropPosition + 1});
      updatedCards.forEach((el, index) => {
        if (index > dropPosition) {
          updatedCards[index] = {...el, position: el.position + 1};
        }
      });

      this.list.cards = updatedCards;

      this.cardService.updateCards(this.boardId(), this.list).subscribe({
        next: () => {
          this.cdr.detectChanges();
          this.listChanged.emit();
          this.placeholder.nativeElement.remove();
        },
        error: (err) => {
          console.error('Error while updating cards:', err);
        }
      });
    }
  }
}
