import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title!: string;
}
