
import ReactDOM from 'react-dom';
import { BoardComponent } from './components/BoardComponent';
import { GameBoard } from './game/Board';

const App: React.FC = () => {
    return (
        <div>
            <h1>Hex Games</h1>
            <BoardComponent board={new GameBoard(11)} />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));