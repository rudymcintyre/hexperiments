import { useEffect } from "react";
import HexClient from "../socket/HexClient";
import React from "react";


interface SetupComponentProps {
    players: string[];
    startCallback: (player1: string, player2: string) => void;
};

export const SetupComponent: React.FC<SetupComponentProps> = (props: SetupComponentProps) => {
    const { players, startCallback } = props;
    const [player1, setPlayer1] = React.useState<string>('');
    const [player2, setPlayer2] = React.useState<string>('');

    return (
        <div>
            <h1>Setup</h1>
            <div>
                <form>
                    <h2>Player 1</h2>
                        <select id="player1" onChange={(e) => setPlayer1(e.target.value)} >
                        {players.map((player, i) => {
                            return <option key={i}>{player}</option>
                        })}
                    </select>
                    <h2>Player 2</h2>
                    <select id="player2" onChange={(e) => setPlayer2(e.target.value)} >
                        {players.map((player, i) => {
                            return <option key={i}>{player}</option>
                        })}
                    </select>
                    <button type='submit' onClick={(e) => startCallback(player1, player2)}>Start Game</button>
                </form>
            </div>
        </div>
    )
};