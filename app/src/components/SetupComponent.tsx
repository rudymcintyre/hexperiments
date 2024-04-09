import { useEffect } from "react";
import HexClient from "../socket/HexClient";
import React from "react";


interface SetupComponentProps {
    players: string[];
    startCallback: (player1: string, player2: string) => void;
};

export const SetupComponent: React.FC<SetupComponentProps> = (props: SetupComponentProps) => {
    const { players, startCallback } = props;

    return (
        <div>
            <h1>Setup</h1>
            <div>
                <h2>Players</h2>
                <ul>
                    {players.map((player, i) => (
                        <li key={i}>{player}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Start Game</h2>
                <button onClick={() => startCallback(players[0], players[1])}>Start</button>
            </div>
        </div>
    )
};