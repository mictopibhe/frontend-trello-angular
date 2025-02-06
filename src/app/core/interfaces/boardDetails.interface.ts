import {User} from './user.interface';
import {CardsList} from './cardList.interface';

export interface BoardDetails {
  title: string;
  custom: any;
  users: User[];
  lists: CardsList[];
}
