
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import HexClient from './socket/HexClient';
import { BoardComponent } from './components/BoardComponent';
import { GameState, Message } from './hextypes';
import { SetupComponent } from './components/SetupComponent';

const App: React.FC = () => {
    const [socket] = React.useState<HexClient>(new HexClient());
    const [game, setGame] = React.useState<GameState>(null);
    const [playerList, setPlayerList] = React.useState<string[]>([]);

    const sub_callback = async (message: string) => {
        const gameState: GameState = JSON.parse(message.toString()) as GameState;
        setGame(gameState);
    }

    const req_callback = async (message: string) => {
        const parsedMessage: Message = JSON.parse(message.toString()) as Message;

        if (parsedMessage.m_type === 'Players') {
            console.log(parsedMessage.data);
            setPlayerList(parsedMessage.data);
        }
    }

    useEffect(() => {
        socket.connect(sub_callback, req_callback);

        socket.send_request(JSON.stringify({m_type: 'Players', data: []}));
    }, []);

    return (
        <div>
             <SetupComponent players={playerList} startCallback={(player1, player2) => {
                 socket.send_request(JSON.stringify({player1, player2}));
             }}/>
        </div>
    );
};

createRoot(document.getElementById('root')).render(<App/>);