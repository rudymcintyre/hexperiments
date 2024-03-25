import GameBoard from "./Board";
import CellValue from "./Cell";
import MoveResult from "./MoveResult";

type PlayRecord = {
    [key in CellValue]: number[][] | null;
}

export class Game {
    private static readonly INITIAL_PLAYER: CellValue = CellValue.RED;

    private board: GameBoard;
    private currentPlayer: CellValue = Game.INITIAL_PLAYER;

    private playRecord: PlayRecord = {
        [CellValue.RED]: [],
        [CellValue.BLUE]: [],
        [CellValue.EMPTY]: null
    };

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
        this.playRecord[this.currentPlayer].push([row, col]);

        if (this.checkWinner()) {
            if (this.currentPlayer === CellValue.RED)
                return MoveResult.RED_WIN;
            return MoveResult.BLUE_WIN;
        }

        this.swapPlayer();

        return MoveResult.VALID;
    }

    checkWinner(): boolean {
        let visited: boolean[][] = Array.from({ length: this.board.getSize() }, () => Array(this.board.getSize()).fill(false));
        
        // all nodes of current player
        for (let [row, col] of this.playRecord[this.currentPlayer]) {
            // dfs on boundary nodes only
            let redStartEdge: boolean = this.currentPlayer === CellValue.RED && col === 0;
            let blueStartEdge: boolean = this.currentPlayer === CellValue.BLUE && row === 0;
            if (redStartEdge || blueStartEdge)
                continue;

            visited[row][col] = true;
            let stack: number[][] = [[row, col]];
            while (stack.length > 0) {
                let [r, c] = stack.pop()!;
                let neighbours = this.board.getNeighbours(r, c);
                for (let [nr, nc] of neighbours) {
                    if (this.board.getCell(nr, nc) === this.currentPlayer) {
                        let redEndEdge: boolean = this.currentPlayer === CellValue.RED
                                && nc === this.board.getSize() - 1;
                        let blueEndEdge: boolean = this.currentPlayer === CellValue.BLUE
                                && nr === this.board.getSize() - 1;

                        if (redEndEdge || blueEndEdge)
                            return true;

                        if (!visited[nr][nc]) {
                            visited[nr][nc] = true;
                            stack.push([nr, nc]);
                        }
                    }
                }
            }
        }

        return false;
    }

    reset(): void {
        this.board.reset();
        this.currentPlayer = Game.INITIAL_PLAYER;

        this.playRecord[CellValue.RED] = [];
        this.playRecord[CellValue.BLUE] = [];
    }

    swapPlayer(): void {
        this.currentPlayer = this.currentPlayer === CellValue.RED ? CellValue.BLUE : CellValue.RED;
    }
}