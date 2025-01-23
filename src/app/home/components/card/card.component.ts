import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CardService} from '../../services/card.service';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title!: string;
  @Input() listId!: string;

  @Output() cardAdded = new EventEmitter<void>();

  inputValue: string = '';

  constructor(private cardService: CardService) {
  }

  createCard() {
    // this.cardService.createCard(this.listId, this.inputValue);
  }
}
