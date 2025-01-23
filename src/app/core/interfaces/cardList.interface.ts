import {Card} from './card.interface';

export interface CardList {
  id: string;
  title: string;
  cards: Card[];
}
