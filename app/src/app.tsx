
import ReactDOM from 'react-dom';
import { BoardComponent } from './components/BoardComponent';
import  GameBoard  from './game/Board';
import CellValue from './game/Cell';
import React from 'react';
import { Game, INITIAL_PLAYER } from './game/Game';

const App: React.FC = () => {
    const [game] = React.useState(new Game(11));

    return (
        <BoardComponent 
            game={game}
            width={window.innerWidth}
            height={window.innerHeight}
        />
    );
};

ReactDOM.render(<App />, document.getElementById('root'));