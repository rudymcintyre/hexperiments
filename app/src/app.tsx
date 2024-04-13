
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import HexClient from './socket/HexClient';
import { BoardComponent } from './components/BoardComponent';
import { GameState, Message, AppState } from './hextypes';
import { SetupComponent } from './components/SetupComponent';

const App: React.FC = () => {
    const [socket] = React.useState<HexClient>(new HexClient());
    const [game, setGame] = React.useState<GameState>(null);
    const [playerList, setPlayerList] = React.useState<string[]>([]);
    const [state, setState] = React.useState<AppState>(AppState.READY);

    const sub_callback = async (message: string) => {
        const gameState: GameState = JSON.parse(message.toString()) as GameState;
        setGame(gameState);
    }

    const req_callback = async (message: string) => {
        let parsedMessage: Message = {m_type: null, data: null};
        try {
            parsedMessage = JSON.parse(message.toString()) as Message;
        } catch (e) {
            console.log(message.toString());
        }

        if (parsedMessage.m_type === 'Players') {
            console.log(parsedMessage.data);
            setPlayerList(parsedMessage.data);
        }
    }

    useEffect(() => {
        socket.connect(sub_callback, req_callback)
        socket.send_request('Players', []);
    }, []);

    if (state == AppState.READY) {
    return (
        <div>
            <SetupComponent players={playerList} startCallback={(player1: string, player2: string) => {
                console.log(player1, player2);
                socket.send_request('Start', [player1, player2]);
                setState(AppState.PLAYING)
            }}/>
        </div>
    );
    } else if (state == AppState.PLAYING) {
        return (
            <BoardComponent game={game} socket={socket} width={window.innerWidth} height={window.innerHeight} />
        );
    }
};

createRoot(document.getElementById('root')).render(<App/>);