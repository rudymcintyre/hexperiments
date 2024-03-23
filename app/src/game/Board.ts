export type CellValue = 'R' | 'B' | '.';

export class GameBoard {
    private board: CellValue[][];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill('.'));

        // fill the board with random test pieces all over
        this.board[0][0] = 'R';
        this.board[size - 1][size - 1] = 'B';
        this.board[size - 1][0] = 'B';
        this.board[0][size - 1] = 'R';
        this.board[size - 1][size - 2] = 'B';
        this.board[size - 2][size - 1] = 'B';
        this.board[0][1] = 'R';
        this.board[1][0] = 'R';

    }

    setCell(row: number, col: number, value: CellValue): void {
        this.board[row][col] = value;
    }

    getBoard(): CellValue[][] {
        return this.board;
    }

    getSize(): number {
        return this.size;
    }

    getCell(row: number, col: number): CellValue {
        return this.board[row][col];
    }
}