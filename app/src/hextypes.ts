export enum CellValue {
    RED = 'Red',
    BLUE = 'Blue',
    EMPTY = 'Empty',
}

export interface GameState {
    board: CellValue[][];
    current_player: CellValue;
}

export enum ReplyType {
    BLUE_WIN = 'BlueWin',
    RED_WIN = 'RedWin',
    VALID = 'Valid',
    INVALID = 'Invalid',
    PLAYERS = 'Players',
}

export interface Message {
    type: ReplyType;
    message: [] | null;
}