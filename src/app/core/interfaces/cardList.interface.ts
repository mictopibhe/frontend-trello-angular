import {ICard} from './card.interface';

export interface ICardsList {
  id: number;
  title: string;
  cards: ICard[];
}
