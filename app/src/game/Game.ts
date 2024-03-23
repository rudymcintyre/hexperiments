import GameBoard from "./Board";
import CellValue from "./Cell";
import MoveResult from "./MoveResult";

export const INITIAL_PLAYER = CellValue.RED;

export class Game {
    private board: GameBoard;
    private currentPlayer: CellValue = INITIAL_PLAYER;

    constructor(size: number) {
        this.board = new GameBoard(size);
    }

    getBoard(): GameBoard {
        return this.board;
    }

    getCurrentPlayer(): CellValue {
        return this.currentPlayer;
    }

    play(row: number, col: number): MoveResult {
        const cell = this.board.getCell(row, col);
        if (cell !== CellValue.EMPTY) {
            return MoveResult.INVALID;
        }

        this.board.setCell(row, col, this.currentPlayer);
        this.swapPlayer();
    }

    swapPlayer(): void {
        this.currentPlayer = this.currentPlayer === CellValue.RED ? CellValue.BLUE : CellValue.RED;
    }
}