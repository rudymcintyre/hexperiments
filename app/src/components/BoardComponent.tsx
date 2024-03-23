import React, { useEffect } from 'react';
import { CellValue, GameBoard } from '../game/Board';
import { Stage, Layer, Rect, RegularPolygon } from 'react-konva';

interface BoardComponentProps {
    board: GameBoard;
    width: number;
    height: number;
    playMove: (row: number, col: number) => void;
    player: CellValue;
};

interface FillMap {
    [key: string]: string;
}

const fillMap: FillMap = {
    'R': 'red',
    'B': 'blue',
    '.': 'white',
};

const cellRadius = 25;
const drawOffset = cellRadius + 1;
const cellWidth = cellRadius * 2;

export const BoardComponent: React.FC<BoardComponentProps> = (props: BoardComponentProps) => {
    const { board, width, height, playMove, player } = props;

    const renderCell = (row: number, col: number) => {
        const fill = fillMap[board.getCell(row, col)];
        const xPos = drawOffset + (col * cellWidth) + (row * cellRadius);
        const yPos = drawOffset + (row * cellRadius * 1.8);

        return (
            <RegularPolygon 
                key={`${row},${col}`}
                radius={cellRadius}
                sides={6} 
                x={xPos}
                y={yPos}
                stroke='black'
                fill={fill}
                onClick={() => playMove(row, col)}
            />
        );
    }

    let boardJSX = [];
    for (let row = 0; row < board.getSize(); row++) {
        for (let col = 0; col < board.getSize(); col++) {
            boardJSX.push(renderCell(row, col));
        }
    }

    return (
        <Stage width={width} height={height}>
            <Layer>
                {boardJSX}
            </Layer>
        </Stage>
    );
};