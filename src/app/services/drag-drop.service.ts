import {Injectable, signal} from '@angular/core';
import {ICardsList} from '../core/interfaces/cardList.interface';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  targetList = signal<ICardsList | null>(null);
  isDroppedInZone = signal<boolean>(false);
}
