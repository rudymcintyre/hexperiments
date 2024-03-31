
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
        if (this.playRecord[this.currentPlayer].length < this.board.getSize())
            return false;

        let visited: boolean[][] = this.fill2DArray(this.board.getSize(), this.board.getSize(), false);
        
        // all nodes of current player
        for (let [row, col] of this.playRecord[this.currentPlayer]) {
            // dfs on boundary nodes only
            let redStartEdge: boolean = this.currentPlayer === CellValue.RED && col === 0;
            let blueStartEdge: boolean = this.currentPlayer === CellValue.BLUE && row === 0;

            if (visited[row][col] || !(redStartEdge || blueStartEdge))
                continue;

            if (this.dfsOnNode(row, col, visited))
                return true;
        }

        return false;
    }

    private dfsOnNode(row: number, col: number, visited: boolean[][]): boolean {
        visited[row][col] = true;
        let currentStack: number[][] = [[row, col]];

        while (currentStack.length > 0) {
            let [r, c] = currentStack.pop()!;

            let neighbours = this.board.getNeighbours(r, c);
            for (let [nr, nc] of neighbours) {
                if (this.board.getCell(nr, nc) !== this.currentPlayer)
                    continue;

                // check if winning node is found
                let redEndEdge: boolean = this.currentPlayer === CellValue.RED
                        && nc === this.board.getSize() - 1;
                let blueEndEdge: boolean = this.currentPlayer === CellValue.BLUE
                        && nr === this.board.getSize() - 1;
                if (redEndEdge || blueEndEdge)
                    return true;

                // continue dfs
                if (!visited[nr][nc]) {
                    visited[nr][nc] = true;
                    currentStack.push([nr, nc]);
                }
            }
        }
    }

    private fill2DArray<T>(rows: number, cols: number, value: T): T[][] {
        return Array.from({ length: rows }, () => Array(cols).fill(value));
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