import {ResolveFn} from '@angular/router';
import {Board} from "../../core/interfaces/board.interface";
import {inject} from "@angular/core";
import {BoardService} from "../services/board.service";
import {Observable} from "rxjs";

export const boardResolver: ResolveFn<Observable<Board[]>> = () => {
    const boardService = inject(BoardService);
    return boardService.getBoards();
};
