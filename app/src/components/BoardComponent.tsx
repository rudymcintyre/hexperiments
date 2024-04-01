
import { Stage, Layer, Text, RegularPolygon } from 'react-konva';
import React from 'react';

// type FillMap = {
//     [key in CellValue]: string;
// };
// const fillMap: FillMap = {
//     [CellValue.RED]: 'red',
//     [CellValue.BLUE]: 'blue',
//     [CellValue.EMPTY]: 'white',
// };

const cellRadius = 25;
const drawOffset = cellRadius + 1;
const cellWidth = cellRadius * 2;

interface BoardComponentProps {
    width: number;
    height: number;
};
export const BoardComponent: React.FC<BoardComponentProps> = (props: BoardComponentProps) => {
    // const { game, width, height } = props;

    // const [player, setPlayer] = React.useState<CellValue>(game.getCurrentPlayer());
    // const [gameMoveState, setGameMoveState] = React.useState<MoveResult>(MoveResult.VALID);

    const renderCell = (row: number, col: number) => {
        // const fill = fillMap[game.getBoard().getCell(row, col)];
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
                // fill={fill}
                onClick={() => {
                    // if (gameMoveState !== MoveResult.VALID) {
                    //     game.reset();
                    // }
                    // setGameMoveState(game.play(row, col));
                    // setPlayer(game.getCurrentPlayer());
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

    // let boardJSX = [];
    // for (let row = 0; row < game.getBoard().getSize(); row++) {
    //     for (let col = 0; col < game.getBoard().getSize(); col++) {
    //         boardJSX.push(renderCell(row, col));
    //     }
    // }

    return (
        // <Stage width={width} height={height}>
        //     <Layer>
        //         {boardJSX}
        //         <Text text={gameMoveState} x={10} y={300} fontSize={24} />
        //     </Layer>
        // </Stage>
        <Text>Hello</Text>
    );
};