import {Card} from './card.interface';

export interface CardList {
  id: number;
  title: string;
  cards: Card[];
}
