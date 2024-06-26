
import { Stage, Layer, Text, RegularPolygon, Line } from 'react-konva';
import React from 'react';
import { AppState, CellValue, GameState } from '../hextypes';
import HexClient from '../socket/HexClient';

type FillMap = {
    [key in CellValue]: string;
};
const fillMap: FillMap = {
    [CellValue.RED]: 'red',
    [CellValue.BLUE]: 'blue',
    [CellValue.EMPTY]: 'white',
};

const cellRadius = 25;
const drawOffset = cellRadius + 1;
const cellWidth = cellRadius * 2;

interface BoardComponentProps {
    game: GameState;
    socket: HexClient
    stateSetter: (state: AppState) => void;
    width: number;
    height: number;
};
export const BoardComponent: React.FC<BoardComponentProps> = (props: BoardComponentProps) => {
    const { game, socket, stateSetter, width, height } = props;

    if (!game) {
        return <div>Loading...</div>;
    }

    const renderCell = (row: number, col: number) => {
        const fill = fillMap[game.board[row][col]];
        const xPos = drawOffset + (col * cellWidth) + (row * cellRadius);
        const yPos = drawOffset + (row * cellRadius * 1.75);

        return (
            <RegularPolygon 
                key={`${row},${col}`}
                radius={cellRadius}
                sides={6} 
                x={xPos}
                y={yPos}
                stroke='black'
                fill={fill}
                onClick={() => {
                    socket.send_request("MoveRequest", [row, col]);
                }}
                onMouseEnter={(e) => {
                    const cell = e.target;
                    cell.scaleX(1.1);
                    cell.scaleY(1.1);
                }}
                onMouseLeave={(e) => {
                    const cell = e.target;
                    cell.scaleX(1);
                    cell.scaleY(1)
                }}
            />
        );
    }

    let boardJSX = [];
    for (let row = 0; row < game.board.length; row++) {
        for (let col = 0; col < game.board.length; col++) {
            boardJSX.push(renderCell(row, col));
        }
    }

    const reset = () => {
        stateSetter(AppState.READY);
    }

    return (
        <>
            <Stage width={width} height={height}>
                <Layer>
                    <Line points={[0, 0, cellWidth * game.board.length, 0]} stroke='blue' strokeWidth={10} />
                    <Line points={[
                        cellRadius * (game.board.length - 1),
                        1.75 * drawOffset + cellRadius * 1.75 * (game.board.length - 1) + 5,
                        cellRadius * (game.board.length - 1) + cellWidth * game.board.length,
                        1.75 * drawOffset + cellRadius * 1.75 * (game.board.length - 1) + 5]
                    } stroke='blue' strokeWidth={5} />
                    <Line points={[
                        0,
                        0,
                        cellRadius * (game.board.length - 1),
                        1.75 * drawOffset + cellRadius * 1.75 * (game.board.length - 1) + 5,
                    ]} stroke='red' strokeWidth={5} />
                    <Line points={[
                        cellWidth * game.board.length,
                        0, 
                        cellRadius * (game.board.length - 1) + cellWidth * game.board.length,
                        1.75 * drawOffset + cellRadius * 1.75 * (game.board.length - 1) + 5
                    ]} stroke='red' strokeWidth={5} />
                    {boardJSX}
                    <Text text={game.current_player != 'Empty' ? game.current_player : 'Game Over'} x={10} y={300} fontSize={24} />
                    <RegularPolygon text='Reset' radius={cellRadius} sides={6} x={50} y={250} stroke='black' fill='green' onClick={reset} />
                </Layer>
            </Stage>
        </>
    );
};