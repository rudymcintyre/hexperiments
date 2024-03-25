import CellValue from './Cell';

class GameBoard {
    private board: CellValue[][];
    private size: number;

    constructor(size: number) {
        this.size = size;
        this.reset();
    }

    reset(): void {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(CellValue.EMPTY));
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

    getNeighbours(row: number, col: number): number[][] {
        const directions = [
            [-1, 0], [-1, 1], [0, 1], [1, 0], [1, -1], [0, -1]
        ]

        const neighbours: number[][] = [];
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            const isValidNeighbour = newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size;
            if (isValidNeighbour) {
                neighbours.push([newRow, newCol]);
            }
        }

        return neighbours;
    }

}

export default GameBoard;