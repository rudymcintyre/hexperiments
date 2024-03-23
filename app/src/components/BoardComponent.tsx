import React from 'react';
import { GameBoard } from '../game/Board';

interface BoardComponentProps {
    board: GameBoard;
};

export const BoardComponent: React.FC<BoardComponentProps> = ({ board }) => {
    const renderCell = (row: number, col: number) => {
        const cell = board.getCell(row, col);
        return (
            <div key={`S{row}-${col}`} className="cell">
                {cell}
            </div>
        );
    }

    const renderRow = (row: number) => {
        return (
            <div key={row} className="row">
                {Array.from({ length: board.getSize() }, (_, col) => renderCell(row, col))}
            </div>
        );
    }

    return (
        <div className="board">
            {Array.from({ length: board.getSize() }, (_, row) => renderRow(row))}
        </div>
    );
};