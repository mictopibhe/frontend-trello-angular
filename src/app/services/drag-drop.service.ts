import {Injectable, signal} from '@angular/core';
import {CardsList} from '../core/interfaces/cardList.interface';

@Injectable({
  providedIn: 'root'
})
export class DragDropService {
  targetList = signal<CardsList | null>(null);
  isDroppedInZone = signal<boolean>(false);
}
