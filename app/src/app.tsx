
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
        let parsedMessage: Message = {message_type: null, payload: null};
        try {
            parsedMessage = JSON.parse(message.toString()) as Message;
        } catch (e) {
            console.log(message.toString());
        }

        if (parsedMessage.message_type === 'PlayerReply') {
            console.log(parsedMessage.payload);
            setPlayerList(parsedMessage.payload);
        }
    }

    useEffect(() => {
        socket.connect(sub_callback, req_callback)
        socket.send_request('PlayerRequest', []);
    }, []);

    if (state == AppState.READY) {
        return (
            <SetupComponent players={playerList} startCallback={(player1: string, player2: string) => {
                socket.send_request('PlayerReply', [player1, player2]);
                setState(AppState.PLAYING)
            }}
            />
        );
    } else if (state == AppState.PLAYING) {
        return (
            <BoardComponent game={game} socket={socket} stateSetter={setState} width={window.innerWidth} height={window.innerHeight} />
        );
    }
};

createRoot(document.getElementById('root')).render(<App/>);