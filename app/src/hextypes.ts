export enum CellValue {
    RED = 'Red',
    BLUE = 'Blue',
    EMPTY = 'Empty',
}

export interface GameState {
    board: CellValue[][];
    current_player: CellValue;
}