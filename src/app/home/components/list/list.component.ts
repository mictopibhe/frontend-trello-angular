import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {ICard} from '../../../core/interfaces/icard.interface';
import {NgForOf} from '@angular/common';
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'tr-list',
  imports: [
    NgForOf,
    CardComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  @Input() title!: string;
  @Input() cards!: ICard[];
}
