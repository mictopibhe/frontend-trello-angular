import {IUser} from './user.interface';
import {ICardsList} from './cardList.interface';

export interface IBoardDetails {
  title: string;
  custom: any;
  users: IUser[];
  lists: ICardsList[];
}
