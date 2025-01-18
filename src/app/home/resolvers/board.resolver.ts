import {ResolveFn} from '@angular/router';
import {Boards} from '../../core/interfaces/boards.interface';
import {of} from 'rxjs';
import {Board} from '../../core/interfaces/board.interface';

export const boardResolver: ResolveFn<Board> = (route, state) => {
    const boardId: string = route.params['id'];
    const board: Board = {
        title: "Моя дошка",
        lists: [
            {
                id: 1,
                title: "Заплановані справи",
                cards: [
                    {id: 1, title: "вимити свою кішечку"},
                    {id: 2, title: "поспати"},
                    {id: 3, title: "сходити в магазин"}
                ]
            },
            {
                id: 2,
                title: "В процесі",
                cards: [
                    {id: 4, title: "подивитись серіальчик"},
                    {id: 5, title: "покакати"}
                ]
            },
            {
                id: 3,
                title: "Виконано",
                cards: [
                    {id: 6, title: "покакати"},
                    {id: 7, title: "попрацювати"}
                ]
            },
            {
                id: 3,
                title: "Виконано",
                cards: [
                    {id: 6, title: "покакати"},
                    {id: 7, title: "попрацювати"}
                ]
            },
            {
                id: 3,
                title: "Виконано",
                cards: [
                    {id: 6, title: "покакати"},
                    {id: 7, title: "попрацювати"}
                ]
            }
        ]
    };
    return of(
        board
        // boards.find(board => board.id === +boardId) || { id: 0, title: 'Не найдено', color: '' }
    );
};
