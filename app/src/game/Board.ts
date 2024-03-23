type CellValue = 'R' | 'B' | '.';

export class GameBoard {
    private board: CellValue[][];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill('.'));
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