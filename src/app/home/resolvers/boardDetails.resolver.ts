import {ResolveFn} from '@angular/router';
import {Board} from '../../core/interfaces/board.interface';
import {of} from 'rxjs';
import {BoardDetails} from '../../core/interfaces/boardDetails.interface';
import {inject} from '@angular/core';
import {BoardDetailsService} from '../services/board-details.service';

export const boardDetailsResolver: ResolveFn<BoardDetails> = (route, state) => {
    const boardId: string = route.params['id'];
    const boardDetailsService = inject(BoardDetailsService);
    return boardDetailsService.getBoardDetails(boardId);
};
