
import ReactDOM from 'react-dom';
import { BoardComponent } from './components/BoardComponent';
import { CellValue, GameBoard } from './game/Board';
import React from 'react';

const App: React.FC = () => {
    const [board] = React.useState(new GameBoard(11));
    const [player, setPlayer] = React.useState<CellValue>('R');

    const playMove = (row: number, col: number) => {
        console.log(`Playing move at ${row}, ${col}`);
        if (board.getCell(row, col) === '.') {
            board.setCell(row, col, player);
            setPlayer(player === 'R' ? 'B' : 'R');
        }
    };

    return (
        <BoardComponent 
            board={board}
            width={window.innerWidth}
            height={window.innerHeight}
            playMove={playMove}
            player={player}
        />
    );
};

ReactDOM.render(<App />, document.getElementById('root'));