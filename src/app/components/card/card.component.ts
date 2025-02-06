import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Card} from '../../core/interfaces/card.interface';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() card!: Card;
}
