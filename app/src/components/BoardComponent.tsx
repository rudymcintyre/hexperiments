
import { Stage, Layer, Text, RegularPolygon } from 'react-konva';
import React from 'react';
import { CellValue, GameState } from '../hextypes';

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
    width: number;
    height: number;
};
export const BoardComponent: React.FC<BoardComponentProps> = (props: BoardComponentProps) => {
    const { game, width, height } = props;

    if (!game) {
        return <div>Loading...</div>;
    }

    const [player, setPlayer] = React.useState<CellValue>(game?.current_player);

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
                    console.log(`Clicked on cell ${row}, ${col}`);
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

    return (
        <Stage width={width} height={height}>
            <Layer>
                {boardJSX}
                <Text text={"hello"} x={10} y={300} fontSize={24} />
            </Layer>
        </Stage>
    );
};