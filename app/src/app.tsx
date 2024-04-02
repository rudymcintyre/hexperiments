
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import HexClient from './socket/HexClient';
import { BoardComponent } from './components/BoardComponent';
import { GameState } from './hextypes';

const App: React.FC = () => {
    const [socket] = React.useState<HexClient>(new HexClient());
    const [game, setGame] = React.useState<GameState>(null);

    const sub_callback = async (message: string) => {
        const gameState: GameState = JSON.parse(message.toString()) as GameState;
        setGame(gameState);
    }

    const req_callback = async (topic: string, message: string) => {
        console.log("reply:", Buffer.from(topic).toString());
    }

    useEffect(() => {
        socket.connect(sub_callback, req_callback);
    }, []);

    return (
        <div>
            {<BoardComponent game={game} width={window.innerWidth} height={window.innerHeight}/>}
        </div>
    );
};

createRoot(document.getElementById('root')).render(<App/>);