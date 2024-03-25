
import ReactDOM from 'react-dom';
import { BoardComponent } from './components/BoardComponent';
import React from 'react';
import { Game } from './game/Game';

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