export enum CellValue {
    RED = 'Red',
    BLUE = 'Blue',
    EMPTY = 'Empty',
}

export enum AppState {
    READY,
    PLAYING,
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
    PLAYERS = 'PlayerReply',
}

export interface Message {
    message_type: ReplyType;
    payload: [] | null;
}